import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WhatsAppReminders from "./WhatsAppReminders";
import { getTomorrowLebanonDate } from "../utils/dateTime";

describe("WhatsApp reminder filters", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    const tomorrow = getTomorrowLebanonDate();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify([
          {
            id: 1,
            patientName: "Tomorrow Waiting",
            phone: "03123456",
            message: "Appointment reminder",
            type: "AppointmentReminder",
            date: tomorrow,
            time: "10:00",
            isSent: false,
          },
          {
            id: 2,
            patientName: "Tomorrow Sent",
            phone: "03123456",
            message: "Appointment reminder",
            type: "AppointmentReminder",
            date: tomorrow,
            time: "11:00",
            isSent: true,
          },
          {
            id: 3,
            patientName: "Tomorrow Cleaning",
            phone: "03123456",
            message: "Cleaning reminder",
            type: "CleaningReminder",
            date: tomorrow,
            time: "",
            isSent: true,
          },
          {
            id: 4,
            patientName: "Future Cleaning",
            phone: "03123456",
            message: "Cleaning reminder",
            type: "CleaningReminder",
            date: "2099-01-01",
            time: "",
            isSent: false,
          },
          {
            id: 5,
            patientName: "Past Submitted",
            phone: "03123456",
            message: "Appointment reminder",
            type: "AppointmentReminder",
            date: "2020-01-01",
            time: "09:00",
            isSent: true,
          },
        ]),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    localStorage.clear();
  });

  test("shows all-time statuses and filters tomorrow by status and reminder type", async () => {
    render(<WhatsAppReminders />);

    expect(await screen.findByText("Tomorrow Waiting")).toBeInTheDocument();
    expect(screen.getByText("Future Cleaning")).toBeInTheDocument();
    expect(screen.queryByText("Past Submitted")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("radio", { name: /Tomorrow not submitted/ }),
    );
    expect(await screen.findByText("Tomorrow Waiting")).toBeInTheDocument();
    expect(screen.queryByText("Future Cleaning")).not.toBeInTheDocument();
    expect(screen.queryByText("Tomorrow Cleaning")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("radio", { name: /Tomorrow submitted/ }),
    );
    expect(await screen.findByText("Tomorrow Sent")).toBeInTheDocument();
    expect(screen.getByText("Tomorrow Cleaning")).toBeInTheDocument();
    expect(screen.queryByText("Tomorrow Waiting")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "Cleaning" }));
    await waitFor(() => {
      expect(screen.queryByText("Tomorrow Sent")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Tomorrow Cleaning")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "All types" }));
    fireEvent.click(
      screen.getByRole("radio", { name: /Submitted \(all time\)/ }),
    );
    expect(screen.getByText("Past Submitted")).toBeInTheDocument();
    expect(screen.getByText("Tomorrow Cleaning")).toBeInTheDocument();
  });
});
