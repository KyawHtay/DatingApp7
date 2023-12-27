namespace API.Entities
{
    public class UserLike
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public AppUser TargetUser{set;get;}
        public int TargetUserId { get; set; }
    }
}