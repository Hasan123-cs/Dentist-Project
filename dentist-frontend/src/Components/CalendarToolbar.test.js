import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import dayjs from "dayjs";
import CalendarToolbar from "./CalendarToolbar";

function DragNavigationHarness() {
  const [currentDate, setCurrentDate] = useState(dayjs("2024-11-04"));

  return (
    <CalendarToolbar
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      view="week"
      setView={() => {}}
      isDraggingAppointment
    />
  );
}

test("hovering a week arrow during a drag changes the displayed week", () => {
  render(<DragNavigationHarness />);

  fireEvent.dragEnter(screen.getByRole("button", { name: "Next week" }));

  expect(screen.getByText("Nov 11 - Nov 17, 2024")).toBeInTheDocument();
});
