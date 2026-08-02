var builder = WebApplication.CreateBuilder(args);

// Add YARP Reverse Proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Add Health Checks & Swagger
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowEnterpriseOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "https://app.talentos.ai")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowEnterpriseOrigins");

app.MapHealthChecks("/health");

app.MapGet("/", () => Results.Ok(new { 
    service = "TalentOS Enterprise API Gateway (.NET 9)", 
    status = "online", 
    routing = "YARP Reverse Proxy -> IdentityService & Python AI Platform" 
}));

app.MapReverseProxy();

app.Run();
