namespace API;

public class ApiException
{
    
    public ApiException(int statusCode,string message,string details)
    {
        Message = message;
        Details = details;
        StatusCode = statusCode;
    }
    public int StatusCode { get; set; }
     public string Message { get; set; }

     public string Details { get; set; }
   
}
