namespace dentist_project.Services;

public class NotificationBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<NotificationBackgroundService> _logger;

    public NotificationBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<NotificationBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }


    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            "Notification background service started."
        );


        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope =
                    _scopeFactory.CreateScope();


                var notificationService =
                    scope.ServiceProvider
                        .GetRequiredService<
                            INotificationService
                        >();


                // Check appointment reminders
                await notificationService
                    .ProcessAppointmentRemindersAsync();


                // Check cleaning recalls
                await notificationService
                    .ProcessCleaningRecallsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error while processing notifications."
                );
            }


            // Check again after 1 hour
            await Task.Delay(
                TimeSpan.FromHours(1),
                stoppingToken
            );
        }
    }
}