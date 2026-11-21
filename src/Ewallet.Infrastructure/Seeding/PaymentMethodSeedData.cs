
using Ewallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Persistence.Seeders;

public static class PaymentMethodSeedData
{
    private static IEnumerable<PaymentMethod> InitialPaymentMethods()
    {
        var baseTime = new DateTime(2026, 1,1,0,0,0,DateTimeKind.Utc);

        yield return new PaymentMethod(0, "VA_BCA", "BCA Virtual Account", "Bank BCA", true, baseTime);
        yield return new PaymentMethod(0, "VA_MANDIRI", "Mandiri Virtual Account", "Bank Mandiri", true, baseTime);
        yield return new PaymentMethod(0, "QRIS", "QRIS Instant", "Midtrans", true, baseTime);
        yield return new PaymentMethod(0, "RETAIL_ALFA", "Alfamart Gerai", "Alfamart", true, baseTime);
    }

    public static void Seed(DbContext context)
    {
        foreach (var pm in InitialPaymentMethods())
        {
            bool exists = context.Set<PaymentMethod>().Any(x => x.Code == pm.Code);
            if (!exists)
            {
                context.Set<PaymentMethod>().Add(pm);
            }
        }
        context.SaveChanges();
    }

    public static async Task SeedAsync(DbContext context, CancellationToken ct = default)
    {
        foreach (var pm in InitialPaymentMethods())
        {
            bool exists = await context.Set<PaymentMethod>().AnyAsync(x => x.Code == pm.Code, ct);
            if (!exists)
            {
                context.Set<PaymentMethod>().Add(pm);
            }
        }
        await context.SaveChangesAsync(ct);
    }


}
