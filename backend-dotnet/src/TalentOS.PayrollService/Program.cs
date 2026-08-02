var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "online", service = "TalentOS .NET 9 PayrollService", version = "9.0.0" }));

app.Run("http://localhost:5004");
