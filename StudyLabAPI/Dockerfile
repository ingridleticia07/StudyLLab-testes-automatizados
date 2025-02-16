# Build stage: Use .NET 8 SDK to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project files and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy remaining files and publish the project
COPY . ./
RUN dotnet publish -c Release -o /app/out

# Runtime stage: Use ASP.NET Core runtime to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the output from the build stage
COPY --from=build /app/out .

# Create and set permissions for wwwroot directory
RUN mkdir -p /app/wwwroot/documents && \
    chmod -R 777 /app/wwwroot && \
    chown -R www-data:www-data /app/wwwroot

# Expose the port for the application
EXPOSE 80

# Set environment variables
ENV ASPNETCORE_URLS=http://0.0.0.0:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "StudyLabAPI.dll"]
