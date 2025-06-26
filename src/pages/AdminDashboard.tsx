import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { format } from 'date-fns';

type User = {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  subscription: {
    isSubscribed: boolean;
    subscriptionDate?: Date;
    plan: string;
  };
  likes: string[];
  lastLogin?: Date;
};

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleSubscription = async (userId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'subscription.isSubscribed': !currentStatus,
        'subscription.subscriptionDate': currentStatus ? null : new Date()
      });
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              subscription: { 
                ...user.subscription, 
                isSubscribed: !currentStatus,
                subscriptionDate: currentStatus ? undefined : new Date()
              } 
            } 
          : user
      ));
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all registered users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium flex items-center space-x-2">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span>{user.displayName || 'N/A'}</span>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isAdmin 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.subscription?.isSubscribed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.subscription?.isSubscribed 
                      ? `Subscribed (${user.subscription.plan})` 
                      : 'Not Subscribed'}
                  </span>
                </TableCell>
                <TableCell>
                  {user.lastLogin 
                    ? format(new Date(user.lastLogin as unknown as string), 'PPpp')
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSubscription(user.id, user.subscription?.isSubscribed || false)}
                    className={`${
                      user.subscription?.isSubscribed 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {user.subscription?.isSubscribed ? 'Revoke' : 'Approve'} Subscription
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
