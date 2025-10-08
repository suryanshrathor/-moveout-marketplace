class JSONBinService {
    constructor() {
        this.itemsBinId = '68e36b4843b1c97be95c0557';
        this.usersBinId = '68e4c872ae596e708f08f000'; // Replace with actual users bin ID
        this.apiKey = '$2a$10$5r7RfPJuvTy7CAjOluJgV.NfRRMIv/Kvg0cntE6kpQsbShRnNuTha';
        this.baseUrl = 'https://api.jsonbin.io/v3/b';
    }

    async getAllItems() {
        try {
            console.log('Fetching items from JSONBin...');
            const response = await fetch(`${this.baseUrl}/${this.itemsBinId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('JSONBin items response:', data);
                return data.record?.items || [];
            } else {
                console.error('JSONBin fetch error:', response.status, response.statusText);
                return [];
            }
        } catch (error) {
            console.error('Error fetching items from JSONBin:', error);
            return [];
        }
    }

    async getAllUsers() {
        try {
            console.log('Fetching users from JSONBin...');
            const response = await fetch(`${this.baseUrl}/${this.usersBinId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('JSONBin users response:', data);
                return data.record?.users || [];
            } else {
                console.error('JSONBin fetch error:', response.status, response.statusText);
                return [];
            }
        } catch (error) {
            console.error('Error fetching users from JSONBin:', error);
            return [];
        }
    }

    async saveAllItems(items) {
        try {
            console.log('Saving items to JSONBin:', items.length, 'items');
            const payload = JSON.stringify({ items, lastUpdated: new Date().toISOString() });
            const payloadSize = new TextEncoder().encode(payload).length;
            console.log('Items payload size:', payloadSize, 'bytes');
            if (payloadSize > 100000) {
                console.warn('Payload exceeds 100KB; cleaning up old items');
                await this.cleanupOldItems(3);
                return await this.saveAllItems(items.slice(0, 3)); // Retry with fewer items
            }
            const response = await fetch(`${this.baseUrl}/${this.itemsBinId}`, {
                method: 'PUT',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: payload
            });
            if (response.ok) {
                console.log('✅ Items saved successfully to JSONBin');
                return true;
            } else {
                console.error('❌ JSONBin save error:', response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error saving items to JSONBin:', error);
            return false;
        }
    }
    async updateUser(userId, updatedUser) {
        console.log(`Updating user ${userId} in JSONBin...`);
        try {
            const users = await this.getAllUsers();
            const userIndex = users.findIndex(user => String(user.id) === String(userId));
            if (userIndex === -1) {
                users.push(updatedUser);
            } else {
                users[userIndex] = { ...users[userIndex], ...updatedUser };
            }
            const response = await fetch('https://api.jsonbin.io/v3/b/68e36b4b43b1c97be95c0561', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': '$2a$10$7lWBLD8Ck/r/0N5B0NHa0eZ/5hRyOATbH2dqumC2c4N2LU6n6b4/u'
                },
                body: JSON.stringify({ users })
            });
            const data = await response.json();
            console.log('✅ User updated successfully in JSONBin');
            return data;
        } catch (error) {
            console.error('Error updating user in JSONBin:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        console.log(`Deleting user ${userId} from JSONBin...`);
        try {
            const users = await this.getAllUsers();
            const updatedUsers = users.filter(user => String(user.id) !== String(userId));
            const response = await fetch('https://api.jsonbin.io/v3/b/68e36b4b43b1c97be95c0561', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': '$2a$10$7lWBLD8Ck/r/0N5B0NHa0eZ/5hRyOATbH2dqumC2c4N2LU6n6b4/u'
                },
                body: JSON.stringify({ users: updatedUsers })
            });
            const data = await response.json();
            console.log('✅ User deleted successfully from JSONBin');
            return data;
        } catch (error) {
            console.error('Error deleting user from JSONBin:', error);
            throw error;
        }
    }

    async saveAllUsers(users) {
        try {
            console.log('Saving users to JSONBin:', users.length, 'users');
            const payload = JSON.stringify({ users, lastUpdated: new Date().toISOString() });
            console.log('Users payload size:', new TextEncoder().encode(payload).length, 'bytes');
            const response = await fetch(`${this.baseUrl}/${this.usersBinId}`, {
                method: 'PUT',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: payload
            });
            if (response.ok) {
                console.log('✅ Users saved successfully to JSONBin');
                return true;
            } else {
                console.error('❌ JSONBin save error:', response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error saving users to JSONBin:', error);
            return false;
        }
    }

    async addItem(newItem) {
        try {
            const items = await this.getAllItems();
            newItem.id = Date.now().toString();
            newItem.createdAt = new Date().toISOString();
            items.unshift(newItem);
            const success = await this.saveAllItems(items);
            return success ? { success: true, id: newItem.id } : { success: false, error: 'Failed to save item to JSONBin' };
        } catch (error) {
            console.error('Error adding item to JSONBin:', error);
            return { success: false, error: error.message };
        }
    }

    async cleanupOldItems(maxItems = 3) {
        try {
            const items = await this.getAllItems();
            if (items.length > maxItems) {
                console.log(`Cleaning up items; keeping newest ${maxItems}`);
                const recentItems = items.slice(0, maxItems);
                await this.saveAllItems(recentItems);
            }
        } catch (error) {
            console.error('Error cleaning up old items:', error);
        }
    }

    async loginUser(email, password) {
        try {
            const users = await this.getAllUsers();
            const hashedPassword = CryptoJS.SHA256(password).toString();
            const user = users.find(u => u.email === email && u.password === hashedPassword);
            if (!user) {
                return { success: false, error: 'Invalid email or password' };
            }
            return { success: true, user };
        } catch (error) {
            console.error('Error logging in:', error);
            return { success: false, error: error.message };
        }
    }

    async registerUser(userData) {
        try {
            const users = await this.getAllUsers();
            if (users.find(u => u.email === userData.email)) {
                return { success: false, error: 'Email already registered' };
            }
            const newUser = {
                id: Date.now().toString(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                location: userData.location,
                password: CryptoJS.SHA256(userData.password).toString(),
                newsletter: userData.newsletter,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            const success = await this.saveAllUsers(users);
            return success ? { success: true, user: newUser } : { success: false, error: 'Failed to register user' };
        } catch (error) {
            console.error('Error registering user:', error);
            return { success: false, error: error.message };
        }
    }

    async testConnection(binId = this.itemsBinId) {
        try {
            console.log(`Testing JSONBin connection for bin ${binId}...`);
            const response = await fetch(`${this.baseUrl}/${binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            if (response.ok) {
                console.log(`✅ JSONBin connection successful for bin ${binId}!`);
                return true;
            } else {
                console.error(`❌ JSONBin connection failed for bin ${binId}:`, response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error(`❌ JSONBin connection error for bin ${binId}:`, error);
            return false;
        }
    }
}

window.jsonBinService = new JSONBinService();