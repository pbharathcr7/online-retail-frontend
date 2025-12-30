import { Component, OnInit } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl } from 'config/apiUrl';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.scss']
})
export class ChatAssistantComponent implements OnInit {
  private baseURL: string = 'https://models.inference.ai.azure.com';
  private apiKey: string = ''; 
  model: any;
  userMessage: string = '';
  chatHistory: { sender: string, text: string }[] = [];
  
  productList: any[] = [];
  orderList: any[] = [];
  productMap: { [key: string]: string } = {};
  chatOpen: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBackendData();
  }

  fetchBackendData() {
    this.http.get<any>(`${apiUrl}/products`).subscribe({
      next: (response) => {
        if (response.data) {
          this.productList = response.data; 
          this.productMap = this.productList.reduce((accumulator, product) => {
            accumulator[product._id] = product.productName;
            return accumulator;
          }, {} as { [key: string]: string });
        }
      },
      error: (error) => {
        console.error("Error fetching products:", error);
      }
    });

    this.http.get<any[]>(`${apiUrl}/orders`).subscribe({
      next: (data) => {
        this.orderList = data.map(order => ({
          OrderId: order._id,
          ProductName: this.productMap[order.productName] || "Unknown Product",
          Quantity: order.quantity,
        }));
      },
      error: (error) => {
        console.error("Error fetching orders:", error);
      }
    });
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  async sendMessage() {
    if (!this.userMessage.trim()) return;

    const userText = this.userMessage;
    this.chatHistory.push({ sender: 'user', text: userText });
    this.userMessage = '';

    this.chatHistory.push({ sender: 'model', text: 'Typing...' });

    let context = '';
    if (userText.toLowerCase().includes("product")) {
      const availableProducts = this.productList.filter(p => p.quantity > 0);
    
      if (availableProducts.length) {
        context = "Here are the products currently in stock:\n\n" + 
          availableProducts.map(p => `🛒 **${p.productName}** - ${p.quantity} available`).join("\n");
      } else {
        context = "Unfortunately, no products are currently in stock.";
      }
    }
    

    const body = {
      messages: [
        { role: "system", content: "You are a chatbot assistant for my online-retail website help customers if they ask about product or order related queries only" },
        { role: "user", content: userText + "\n" + context }
      ],
      model: "gpt-4o-mini",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`${this.baseURL}/chat/completions`, body, { headers })
    .subscribe({
      next: (result: any) => {
        console.log(result);
        this.chatHistory = this.chatHistory.filter(msg => msg.text !== 'Typing...');
        const modelResponse = result.choices[0].message.content || 'Sorry, something went wrong.';
        this.chatHistory.push({ sender: 'model', text: modelResponse });
      },
      error: (error) => {
        console.error("Error:", error);
        this.chatHistory.pop();
        this.chatHistory.push({ sender: 'model', text: 'Error: Could not send message.' });
      }
    });
  }
}
