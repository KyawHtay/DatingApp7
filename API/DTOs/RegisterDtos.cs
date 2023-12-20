using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDtos
    {
        [Required]
        public string Username{set;get;}
        [Required]
        [StringLength(8,MinimumLength =4)]
        public string Password{get;set;}
    }
}