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

# Expose the port for the application
EXPOSE 80

# Set environment variables (consider using a secrets manager)
ENV ASPNETCORE_URLS=http://0.0.0.0:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Use a configuration system for sensitive data
# (e.g., mounted secrets or environment variables)

# Run the application
ENTRYPOINT ["dotnet", "StudyLabAPI.dll"]
