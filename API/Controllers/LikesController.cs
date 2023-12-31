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
        private readonly IUnitOfWork _uow;

        public LikesController(IUnitOfWork uow){
            _uow = uow;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult>  AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _uow.UserRepository.GetUserByUsernameAsAsync(username);
            var sourceUser = await _uow.LikeRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();
            
            if(sourceUser.UserName == username) return BadRequest("You cannot like youself.");

            var userLike = await _uow.LikeRepository.GetUserLike(sourceUserId,likedUser.Id);

            if(userLike !=null) return BadRequest($"You already like this user and unlike {likedUser.KnownAs}");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };
          
            sourceUser.LikedUsers.Add(userLike);
            if(await _uow.Complete()) return Ok();

            return BadRequest("Faled to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams){
           likesParams.UserId = User.GetUserId();
           
            var users = await _uow.LikeRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,
                        users.PageSize, 
                        users.TotalCount,users.TotalPages));
            return Ok(users);
        }
        [HttpDelete("{username}")]
        public async Task<ActionResult> DeleteLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _uow.UserRepository.GetUserByUsernameAsAsync(username);
            var sourceUser = await _uow.LikeRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();
            
            if(sourceUser.UserName == username) return BadRequest("You cannot like youself.");

            var userLike = await _uow.LikeRepository.GetUserLike(sourceUserId,likedUser.Id);

            if(userLike ==null) return BadRequest("You have not liked this user");

            var removeLike= sourceUser.LikedUsers.FirstOrDefault(x=>x.SourceUserId==sourceUserId && x.TargetUserId==likedUser.Id);
            
            if(removeLike==null) return BadRequest("You have not liked this user");
            sourceUser.LikedUsers.Remove(removeLike);
            if(await _uow.Complete()) return Ok();

            return BadRequest("Faled to remove like user");
        }


    }
}