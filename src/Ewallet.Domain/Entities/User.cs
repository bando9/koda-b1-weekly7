using System.Text.Json.Serialization;

namespace Ewallet.Domain.Entities;


[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserStatusEnum {
    ACTIVE, 
    SUSPENDED
}