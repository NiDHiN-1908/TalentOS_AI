using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TalentOS.IdentityService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// JWT Authentication Configuration
var secretKey = Encoding.UTF8.GetBytes("talentos_master_enterprise_secret_key_2026");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secretKey),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// CORS Configuration
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
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
