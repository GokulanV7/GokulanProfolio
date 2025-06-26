import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useToast } from '../components/ui/use-toast';

type UserProfile = {
  displayName: string;
  email: string;
  photoURL: string;
  bio?: string;
  website?: string;
  subscription: {
    isSubscribed: boolean;
    plan: string;
    subscriptionDate?: string;
  };
};

export function ProfilePage() {
  const { currentUser, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setProfile({
            displayName: userDoc.data().displayName || '',
            email: userDoc.data().email || '',
            photoURL: userDoc.data().photoURL || '',
            bio: userDoc.data().bio || '',
            website: userDoc.data().website || '',
            subscription: {
              isSubscribed: userDoc.data().subscription?.isSubscribed || false,
              plan: userDoc.data().subscription?.plan || 'free',
              subscriptionDate: userDoc.data().subscription?.subscriptionDate?.toDate().toLocaleDateString()
            }
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !profile) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: profile.displayName,
        bio: profile.bio,
        website: profile.website,
      });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!currentUser || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
          <Button onClick={() => window.location.href = '/login'}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/3">
            <Card>
              <CardHeader className="items-center text-center">
                <div className="relative">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                    <AvatarFallback>
                      {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{profile.displayName}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
                
                <div className="mt-4 w-full">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    profile.subscription.isSubscribed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.subscription.isSubscribed 
                      ? `Subscribed (${profile.subscription.plan})` 
                      : 'Free Plan'}
                  </div>
                  {profile.subscription.subscriptionDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Member since {profile.subscription.subscriptionDate}
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {profile.website && (
                    <div>
                      <p className="text-xs text-muted-foreground">Website</p>
                      <a 
                        href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={signOut}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Side - Profile Form */}
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and email address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={profile.displayName}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profile.bio || ''}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        https://
                      </span>
                      <Input
                        id="website"
                        name="website"
                        value={profile.website?.replace(/^https?:\/\//, '') || ''}
                        onChange={(e) => {
                          // Remove any http:// or https:// that user might type
                          const value = e.target.value.replace(/^https?:\/\//, '');
                          setProfile(prev => ({
                            ...prev!,
                            website: value
                          }));
                        }}
                        placeholder="yourwebsite.com"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Subscription Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription plan and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {profile.subscription.isSubscribed 
                          ? `Current Plan (${profile.subscription.plan})` 
                          : 'Free Plan'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {profile.subscription.isSubscribed 
                          ? `Subscribed on ${profile.subscription.subscriptionDate}`
                          : 'Upgrade to access premium features'}
                      </p>
                    </div>
                    <Button variant="outline" disabled={profile.subscription.isSubscribed}>
                      {profile.subscription.isSubscribed ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
