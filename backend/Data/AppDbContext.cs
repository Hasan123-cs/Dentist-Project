using 
    dentist_project.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace dentist_project.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(
      DbContextOptions<AppDbContext> options
  ) : base(options)
        {
        }


        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentTreatment> AppointmentTreatments { get; set; }

        public DbSet<MedicalRecord> MedicalRecords { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<RecallReminder> RecallReminders { get; set; }

        public DbSet<Tooth> Teeth { get; set; }

        public DbSet<ToothTreatment> ToothTreatments { get; set; }

        public DbSet<Treatment> Treatments { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Appointment>()
                .HasOne(a => a.CreatedBy)
                .WithMany(u => u.AppointmentsCreated)
                .HasForeignKey(a => a.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<MedicalRecord>()
                .HasOne(m => m.CreatedBy)
                .WithMany(u => u.MedicalRecordsCreated)
                .HasForeignKey(m => m.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<MedicalRecord>()
                .HasOne(m => m.Patient)
                .WithMany(p => p.MedicalRecords)
                .HasForeignKey(m => m.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<MedicalRecord>()
                .HasOne(m => m.Appointment)
                .WithMany()
                .HasForeignKey(m => m.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<AppointmentTreatment>()
                .HasOne(at => at.Appointment)
                .WithMany(a => a.AppointmentTreatments)
                .HasForeignKey(at => at.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<AppointmentTreatment>()
                .HasOne(at => at.Treatment)
                .WithMany(t => t.AppointmentTreatments)
                .HasForeignKey(at => at.TreatmentId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<ToothTreatment>()
                .HasOne(tt => tt.MedicalRecord)
                .WithMany(m => m.ToothTreatments)
                .HasForeignKey(tt => tt.MedicalRecordId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ToothTreatment>()
                .HasOne(tt => tt.Tooth)
                .WithMany(t => t.ToothTreatments)
                .HasForeignKey(tt => tt.ToothId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<ToothTreatment>()
                .HasOne(tt => tt.Treatment)
                .WithMany(t => t.ToothTreatments)
                .HasForeignKey(tt => tt.TreatmentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Notification>()
                .HasOne(n => n.Patient)
                .WithMany(p => p.Notifications)
                .HasForeignKey(n => n.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Notification>()
                .HasOne(n => n.Appointment)
                .WithMany()
                .HasForeignKey(n => n.AppointmentId)
                .OnDelete(DeleteBehavior.SetNull);
            builder.Entity<RecallReminder>()
                .HasOne(r => r.Patient)
                .WithMany(p => p.RecallReminders)
                .HasForeignKey(r => r.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Tooth>()
                .HasIndex(t => t.Number)
                .IsUnique();
        }
    }
}