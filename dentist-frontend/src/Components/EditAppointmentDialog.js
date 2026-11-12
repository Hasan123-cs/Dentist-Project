import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

export default function EditAppointmentDialog({
  appointment,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isTreatmentAppointment =
    appointment?.appointmentType?.toLowerCase() === "treatment";

  useEffect(() => {
    if (!appointment) return;

    setForm({
      patientName: appointment.patientName || "",
      patientPhone: appointment.phone || "",
      date: dayjs(appointment.startDateTime).format("YYYY-MM-DD"),
      startTime: dayjs(appointment.startDateTime).format("HH:mm"),
      endTime: dayjs(appointment.endDateTime).format("HH:mm"),
      notes: appointment.notes || "",
    });
    setError("");
  }, [appointment]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSave = async () => {
    const start = form.startTime
      ? dayjs(`2000-01-01T${form.startTime}`)
      : null;
    const end = form.endTime ? dayjs(`2000-01-01T${form.endTime}`) : null;
    const startMinutes = start ? start.hour() * 60 + start.minute() : null;
    const endMinutes = end ? end.hour() * 60 + end.minute() : null;

    if (
      !form.patientName.trim() ||
      !form.date ||
      !start?.isValid() ||
      !end?.isValid()
    ) {
      setError("Please complete the patient name, date, and appointment times.");
      return;
    }

    if (
      startMinutes < 9 * 60 ||
      endMinutes > 20 * 60 ||
      endMinutes <= startMinutes
    ) {
      setError("Choose a valid time between 09:00 and 20:00.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/appointments/${appointment.id}`,
        {
          patientName: form.patientName.trim(),
          patientPhone: form.patientPhone.trim() || null,
          date: form.date,
          startTime: `${form.startTime}:00`,
          endTime: `${form.endTime}:00`,
          notes: form.notes.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await onSaved();
    } catch (saveError) {
      setError(
        saveError.response?.data?.message ||
          "Unable to update the appointment. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={Boolean(appointment)}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Appointment</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          required
          name="patientName"
          label="Patient / Contact Name"
          value={form.patientName}
          onChange={handleChange}
          disabled={isTreatmentAppointment}
          helperText={
            isTreatmentAppointment
              ? "The patient cannot be changed for a treatment appointment."
              : ""
          }
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          fullWidth
          name="patientPhone"
          label="Phone Number"
          type="tel"
          value={form.patientPhone}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          type="date"
          name="date"
          label="Appointment Date"
          value={form.date}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          type="time"
          name="startTime"
          label="Start Time"
          value={form.startTime}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          type="time"
          name="endTime"
          label="End Time"
          value={form.endTime}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          name="notes"
          label="Notes"
          value={form.notes}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
