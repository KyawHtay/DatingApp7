
using CloudinaryDotNet;

namespace API.Helpers
{
    public class CloudinarySettings
    {
        public string  CloudName { get; set; }
        public string ApiKey {get;set;}
        public string ApiSecret { get; set; }

        public static implicit operator CloudinarySettings(Cloudinary v)
        {
            throw new NotImplementedException();
        }
    }
}