using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikeRepository _likesRepository;
        private readonly ILogger<LikesController> _logger;

        public LikesController(IUserRepository userRepository,
            ILikeRepository likesRepository,
            ILogger<LikesController> logger)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
            _logger = logger;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult>  AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUsernameAsAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();
            
            if(sourceUser.UserName == username) return BadRequest("You cannot like youself.");

            var userLike = await _likesRepository.GetUserLike(sourceUserId,likedUser.Id);

            if(userLike !=null) return BadRequest("You already like this user");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };
          
            sourceUser.LikedUsers.Add(userLike);
            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Faled to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams){
           likesParams.UserId = User.GetUserId();
           
            var users = await _likesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,
                        users.PageSize, 
                        users.TotalCount,users.TotalPages));
            return Ok(users);
        }

        
    }
}