// JSONBin API Service
class JSONBinService {
    constructor() {
        // Replace with your actual values
        this.binId = '68e36b4843b1c97be95c0557'; // From JSONBin URL
        this.apiKey = '$2a$10$5r7RfPJuvTy7CAjOluJgV.NfRRMIv/Kvg0cntE6kpQsbShRnNuTha'; // From account settings
        this.baseUrl = 'https://api.jsonbin.io/v3/b';
    }

    async getAllItems() {
        try {
            console.log('Fetching items from JSONBin...');
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('JSONBin response:', data);
                return data.record.items || [];
            } else {
                console.error('JSONBin fetch error:', response.status, response.statusText);
                return [];
            }
        } catch (error) {
            console.error('Error fetching from JSONBin:', error);
            return [];
        }
    }

    async saveAllItems(items) {
        try {
            console.log('Saving items to JSONBin:', items.length, 'items');
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, { // <-- fixed
                method: 'PUT',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    items: items,
                    lastUpdated: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                console.log('✅ Items saved successfully to JSONBin');
                return true;
            } else {
                console.error('❌ JSONBin save error:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Response:', errorText);
                return false;
            }
        } catch (error) {
            console.error('Error saving to JSONBin:', error);
            return false;
        }
    }


    async addItem(newItem) {
        try {
            // Get current items
            const items = await this.getAllItems();
            
            // Add new item with unique ID
            newItem.id = Date.now().toString();
            newItem.createdAt = new Date().toISOString();
            items.unshift(newItem);
            
            // Save back
            const success = await this.saveAllItems(items);
            return success ? { success: true, id: newItem.id } : { success: false };
        } catch (error) {
            console.error('Error adding item to JSONBin:', error);
            return { success: false };
        }
    }

    // Test connection
    async testConnection() {
        try {
            console.log('Testing JSONBin connection...');
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            
            if (response.ok) {
                console.log('✅ JSONBin connection successful!');
                return true;
            } else {
                console.error('❌ JSONBin connection failed:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ JSONBin connection error:', error);
            return false;
        }
    }
}

// Export service
window.jsonBinService = new JSONBinService();
