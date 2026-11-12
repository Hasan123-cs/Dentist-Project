import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import WeeklyCalendar from "./WeeklyCalendar";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

test("shows appointments that start between half-hour calendar slots", () => {
  render(
    <WeeklyCalendar
      currentDate={dayjs("2024-11-04")}
      view="day"
      appointments={[
        {
          id: 1,
          patientName: "Quarter-hour visit",
          startDateTime: "2024-11-04T19:45:00",
          endDateTime: "2024-11-04T20:00:00",
          status: "Pending",
        },
      ]}
      setAppointments={() => {}}
      cancelAppointment={() => {}}
    />,
  );

  expect(screen.getByText("Quarter-hour visit")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Edit Quarter-hour visit" }));

  expect(screen.getByRole("dialog")).toHaveTextContent("Edit Appointment");
});
