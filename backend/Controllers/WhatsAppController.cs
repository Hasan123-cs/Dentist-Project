//using Microsoft.AspNetCore.Mvc;
//using dentist_project.Services;

//namespace dentist_project.Controllers
//{
//    [ApiController]
//    [Route("api/whatsapp")]
//    public class WhatsAppController : ControllerBase
//    {
//        private readonly WhatsAppService _whatsappService;


//        public WhatsAppController(
//            WhatsAppService whatsappService)
//        {
//            _whatsappService = whatsappService;
//        }


//        [HttpGet("test")]
//        public async Task<IActionResult> Test()
//        {
//            var result = await _whatsappService.SendMessage(
//                "96178765159",
//                "Hello from Dr Amani Clinic WhatsApp API test"
//            );


//            return Ok(new
//            {
//                success = result
//            });
//        }
//    }
//}