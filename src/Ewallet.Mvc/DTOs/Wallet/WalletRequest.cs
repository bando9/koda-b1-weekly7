using System.ComponentModel.DataAnnotations;

namespace Ewallet.Mvc.DTOs;


public record WalletRequest(
    [Required(ErrorMessage = "Wallet wajib diisi.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username minimal 3 dan maksimal 50 karakter.")]
    [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username hanya boleh berisi huruf, angka, dan underscore.")]
    string WalletNumber,

    [Required(ErrorMessage = "Password wajib diisi.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password minimal 6 karakter.")]
    string PasswordHash,

    [Required(ErrorMessage = "Email wajib diisi.")]
    [EmailAddress(ErrorMessage = "Format email tidak valid.")]
    [StringLength(100, ErrorMessage = "Email maksimal 100 karakter.")]
    string Email,

    [Required(ErrorMessage = "Nama lengkap wajib diisi.")]
    [StringLength(100, ErrorMessage = "Nama lengkap maksimal 100 karakter.")]
    string FullName,

    [Required(ErrorMessage = "Nomor telepon wajib diisi.")]
    [Phone(ErrorMessage = "Format nomor telepon tidak valid.")]
    [StringLength(20, ErrorMessage = "Nomor telepon maksimal 20 karakter.")]
    string Phone
);