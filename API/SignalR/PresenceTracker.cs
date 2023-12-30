namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string,List<string>> OnlinneUsers = 
            new Dictionary<string, List<string>>();

      
        public Task<bool> UserConnected(string username,string connectionId){
            bool isOnline=false;
            lock(OnlinneUsers)
            {
                if(OnlinneUsers.ContainsKey(username))
                {
                    OnlinneUsers[username].Add(connectionId);
                }
                else{
                    OnlinneUsers.Add(username,new List<string>{connectionId});
                    isOnline= true;
                }
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnect(string username,string connectionId)
        {
            bool isOffline=false;
            lock(OnlinneUsers)
            {
                if(!OnlinneUsers.ContainsKey(username)) return Task.FromResult(isOffline);

                OnlinneUsers[username].Remove(connectionId);

                if(OnlinneUsers[username].Count==0)
                {
                    OnlinneUsers.Remove(username);
                    isOffline=true;

                }     
                
            }
             return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers(){
            string[] onlineusers;
            lock(OnlinneUsers)
            {
                onlineusers = OnlinneUsers.OrderBy(k=>k.Key).Select(k=>k.Key).ToArray();
            }

            return Task.FromResult(onlineusers);
        }
    }
}