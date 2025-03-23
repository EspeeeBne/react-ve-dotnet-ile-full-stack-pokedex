using PokedexBackend.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<LocalJsonStorageService>();
builder.Services.AddHttpClient<PokeApiService>();
builder.Services.AddSingleton<PokeApiService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7161;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllers();

var urls = app.Urls.Count == 0
    ? "http://localhost:5145/"
    : string.Join(", ", app.Urls);


Console.WriteLine($"ℹ️Bu üstteki uyarılara aldırış etme null dönebilir uyarısı gereksiz yaniℹ️");
Console.WriteLine($"🎉 Back-end şu yerde açıldı: {urls}");
Console.WriteLine($"ℹ️  Version: 3.8.0");
Console.WriteLine($"ℹ️  License: MIT");
Console.WriteLine($"ℹ️  Author: EspeeeBne");
Console.WriteLine($"ℹ️  Author Mail: espeebne@proton.me");
Console.WriteLine($"😡Back-end'i açtığına göre front-end'den devam et burayla işin yok artık");

app.Run();
