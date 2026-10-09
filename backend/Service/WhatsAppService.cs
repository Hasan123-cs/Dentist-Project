//using System.Net.Http.Headers;
//using System.Net.Http.Json;

//namespace dentist_project.Services
//{
//    public class WhatsAppService
//    {
//        private readonly HttpClient _httpClient;
//        private readonly IConfiguration _configuration;


//        public WhatsAppService(
//            HttpClient httpClient,
//            IConfiguration configuration)
//        {
//            _httpClient = httpClient;
//            _configuration = configuration;
//        }



//        public async Task<bool> SendMessage(string phone, string message)
//        {
//            var phoneNumberId =
//                _configuration["WhatsApp:PhoneNumberId"]
//                ?? throw new Exception("WhatsApp PhoneNumberId is missing");

//            var accessToken =
//                _configuration["WhatsApp:AccessToken"]
//                ?? throw new Exception("WhatsApp AccessToken is missing");

//            var url =
//                $"https://graph.facebook.com/v20.0/{phoneNumberId}/messages";

//            using var request = new HttpRequestMessage(
//                HttpMethod.Post,
//                url
//            );

//            request.Headers.Authorization =
//                new AuthenticationHeaderValue("Bearer", accessToken);

//            var data = new
//            {
//                messaging_product = "whatsapp",
//                to = phone,
//                type = "text",
//                text = new
//                {
//                    body = message
//                }
//            };

//            request.Content = JsonContent.Create(data);

//            var response = await _httpClient.SendAsync(request);

//            var responseBody = await response.Content.ReadAsStringAsync();

//            Console.WriteLine("========== WHATSAPP RESPONSE ==========");
//            Console.WriteLine($"Status: {(int)response.StatusCode}");
//            Console.WriteLine(responseBody);
//            Console.WriteLine("========================================");

//            return response.IsSuccessStatusCode;
//        }
//    }
//}