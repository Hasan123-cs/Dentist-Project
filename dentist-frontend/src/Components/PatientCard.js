
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  MenuList,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  ListItemText,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  FormHelperText,
  OutlinedInput,
  Popover,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  MoreHoriz,
  Phone,
  CalendarMonth,
  Payments,
  ArrowForward,
} from "@mui/icons-material";

const API_URL = `${process.env.REACT_APP_API_URL}/api/Patients`;

const medicalOptions = [
  "Hypertension",
  "Diabetes",
  "Allergie a penicillin",
  "Allergie",
  "Heart disease",
  "Bleeding discorders",
  "Asthma",
  "Kidney disease",
  "Liver disease",
  "Thyroid disease",
  "Epilepsy",
  "Pregnant",
  "Anticoagulants medicament",
  "Previous endocarditis / prosthetic",
  "heart valve",
  "Cholesterol",
];

export default function PatientCard({ patient, onDelete }) {
  const navigate = useNavigate();

  // THREE DOTS MENU
  const [anchorEl, setAnchorEl] = useState(null);

  // EDIT DIALOG
  const [editOpen, setEditOpen] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);

  // EDIT FIELDS
  const [editPhone, setEditPhone] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // ORIGINAL VALUES
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalNotes, setOriginalNotes] = useState("");

  // TRACK CHANGES
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [notesChanged, setNotesChanged] = useState(false);

  // MEDICAL NOTES DROPDOWN
  const [notesAnchor, setNotesAnchor] = useState(null);

  // OPEN THREE DOTS MENU
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  // CLOSE THREE DOTS MENU
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // OPEN EDIT PATIENT
  const handleEditOpen = async () => {
    handleMenuClose();

    setEditOpen(true);
    setEditError("");
    setLoadFailed(false);
    setLoadingEdit(true);
    setNotesAnchor(null);

    setPhoneChanged(false);
    setNotesChanged(false);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${patient.id}`,
        {
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load patient information."
        );
      }

      const data = await response.json();

      const phone = data.phone || "";
      const medicalHistory = data.medicalHistory || "";

      setEditPhone(phone);
      setOriginalPhone(phone);
      setOriginalNotes(medicalHistory);

      // CONVERT SAVED NOTES TO SELECTED CONDITIONS
      const parts = medicalHistory
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean);

      const foundConditions = [];
      const remainingParts = [];

      parts.forEach((part) => {
        if (medicalOptions.includes(part)) {
          if (!foundConditions.includes(part)) {
            foundConditions.push(part);
          }
        } else {
          // SUPPORT OLDER NOTES FORMAT
          const matchedOption = [...medicalOptions]
            .sort((a, b) => b.length - a.length)
            .find(
              (option) =>
                part === option ||
                part.startsWith(option + " ")
            );

          if (matchedOption) {
            if (!foundConditions.includes(matchedOption)) {
              foundConditions.push(matchedOption);
            }

            const remainingText = part
              .slice(matchedOption.length)
              .trim();

            if (remainingText) {
              remainingParts.push(remainingText);
            }
          } else {
            remainingParts.push(part);
          }
        }
      });

      setSelectedNotes(foundConditions);
      setAdditionalNotes(remainingParts.join("; "));
    } catch (error) {
      console.error("Load patient error:", error);
      setLoadFailed(true);
      setEditError(error.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  // CLOSE EDIT DIALOG
  const handleEditClose = () => {
    if (saving) return;

    setNotesAnchor(null);
    setEditOpen(false);
    setEditError("");
  };

  // UPDATE PHONE INPUT
  const handlePhoneChange = (event) => {
    setEditPhone(event.target.value);
    setPhoneChanged(true);
    setEditError("");
  };

  // OPEN MEDICAL NOTES DROPDOWN
  const handleNotesOpen = (event) => {
    setNotesAnchor(event.currentTarget);
  };

  // CLOSE MEDICAL NOTES DROPDOWN
  const handleNotesClose = () => {
    setNotesAnchor(null);
  };

  // MULTIPLE SELECT - TOGGLE EACH CONDITION
  const toggleMedicalNote = (option) => {
    setSelectedNotes((previous) => {
      if (previous.includes(option)) {
        return previous.filter(
          (note) => note !== option
        );
      }

      return [...previous, option];
    });

    setNotesChanged(true);
    setEditError("");
  };

  // UPDATE ADDITIONAL NOTES
  const handleAdditionalNotesChange = (event) => {
    setAdditionalNotes(event.target.value);
    setNotesChanged(true);
    setEditError("");
  };

  // SAVE EDIT PATIENT

  const handleSaveEdit = async () => {
    setEditError("");

    if (loadFailed || loadingEdit || saving) {
      return;
    }

    const body = {};

    // PHONE NUMBER IS OPTIONAL
    // Only send phone if it was changed
    // Keep old phone if user didn't edit it
    if (phoneChanged && editPhone.trim() !== originalPhone.trim()) {
      body.phone = editPhone.trim();
    }

    // MEDICAL NOTES ARE OPTIONAL
    // Only send notes if they were changed
    if (notesChanged) {
      const newNotes = [
        ...selectedNotes,
        additionalNotes.trim(),
      ]
        .filter(Boolean)
        .join("; ");

      if (newNotes !== originalNotes) {
        body.notes = newNotes;
      }
    }

    // NOTHING CHANGED
    if (Object.keys(body).length === 0) {
      setNotesAnchor(null);
      setEditOpen(false);
      return;
    }
    console.log("UPDATE BODY:", body);
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not authenticated.");
      }

      const response = await fetch(
        `${API_URL}/${patient.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      // Handle JSON and non-JSON API responses
      const responseText = await response.text();

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.title ||
          "Failed to update patient."
        );
      }

      // SUCCESS
      setNotesAnchor(null);
      setEditOpen(false);

      // REFRESH PATIENT DATA
      window.location.reload();
    } catch (error) {
      console.error("Update patient error:", error);

      setEditError(
        error.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE PATIENT
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/${patient.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      onDelete(patient.id);
    } catch (error) {
      console.error(
        "Delete patient error:",
        error
      );
    }
  };

  return (
    <>
      {/* PATIENT CARD */}
      <Paper
        sx={{
          width: "100%",
          height: 520,
          boxSizing: "border-box",
          p: 3,
          borderRadius: 4,
          border: "1px solid #eee3c5",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "0.25s",
          "&:hover": {
            boxShadow:
              "0 10px 25px rgba(0,0,0,.12)",
            transform: "translateY(-4px)",
          },
        }}
      >
        <Box>
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Avatar
              sx={{
                width: 70,
                height: 70,
                background: "#eef2f7",
                color: "#092c57",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {patient.name
                .split(" ")
                .filter(Boolean)
                .map((x) => x[0])
                .join("")}
            </Avatar>

            {/* THREE DOTS */}
            <IconButton
              onClick={handleMenuOpen}
            >
              <MoreHoriz color="action" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditOpen}>
                <EditIcon
                  sx={{
                    mr: 1,
                    color: "#C9A227",
                  }}
                />
                Edit Patient
              </MenuItem>
            </Menu>
          </Box>

          {/* PATIENT ID */}
          <Typography
            fontWeight={800}
            sx={{
              color: "#930b06",
              fontSize: 20,
            }}
          >
            ID : {patient.id}
          </Typography>

          {/* PATIENT NAME */}
          <Box textAlign="center" mt={2}>
            <Typography
              fontSize={18}
              fontWeight={800}
              color="#092c57"
            >
              {patient.name}
            </Typography>

            <Chip
              label={patient.status || "Active"}
              size="small"
              sx={{
                mt: 1,
                background:
                  patient.status === "Inactive"
                    ? "#9ca3af"
                    : "#16a34a",
                color: "#fff",
                fontWeight: 700,
              }}
            />
          </Box>

          {/* PHONE */}
          <Box mt={3} textAlign="center">
            <Phone
              sx={{
                color: "#C9A227",
                fontSize: 22,
              }}
            />

            <Typography fontSize={14} mt={1}>
              {patient.phone || "No phone"}
            </Typography>
          </Box>

          {/* LAST VISIT AND BALANCE */}
          <Box mt={3} textAlign="center">
            <CalendarMonth
              sx={{
                color: "#C9A227",
                fontSize: 22,
              }}
            />

            <Typography
              fontSize={13}
              color="#718096"
            >
              Last Visit
            </Typography>

            <Typography fontWeight={700}>
              {patient.lastVisit ||
                "Not scheduled"}
            </Typography>

            <Payments
              sx={{
                color: "#C9A227",
                fontSize: 22,
                mt: 2,
              }}
            />

            <Typography
              fontSize={13}
              color="#718096"
            >
              Remain Balance
            </Typography>

            <Typography
              fontWeight={700}
              color={
                Number(patient.balance || 0) !== 0
                  ? "#d97706"
                  : "green"
              }
            >
              $
              {Number(
                patient.balance || 0
              ).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* VIEW PATIENT PROFILE */}
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() =>
            navigate(`/patients/${patient.id}`)
          }
          sx={{
            background: "#C9A227",
            borderRadius: 3,
            py: 1.3,
            fontWeight: 800,
            fontSize: 13,
            "&:hover": {
              background: "#b18c1f",
            },
          }}
        >
          VIEW PATIENT PROFILE
        </Button>

        {/* DELETE PATIENT */}
        <IconButton
          onClick={handleDelete}
          sx={{
            color: "red",
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Paper>

      {/* EDIT PATIENT DIALOG */}
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#092c57",
            fontWeight: 800,
          }}
        >
          Edit Patient
        </DialogTitle>

        <DialogContent>
          {editError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {editError}
            </Alert>
          )}

          {loadingEdit ? (
            <Box
              display="flex"
              justifyContent="center"
              p={4}
            >
              <CircularProgress />
            </Box>
          ) : !loadFailed ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                mt: 1,
              }}
            >
              {/* PHONE NUMBER */}
              <TextField
                label="Phone Number"
                type="tel"
                fullWidth
                value={editPhone}
                onChange={handlePhoneChange}
                helperText="Optional: change only if needed"
              />

              {/* MULTIPLE MEDICAL NOTES */}
              <FormControl fullWidth>
                <FormLabel
                  sx={{
                    mb: 1,
                    color: "#092c57",
                  }}
                >
                  Medical Notes
                </FormLabel>

                <OutlinedInput
                  readOnly
                  value={selectedNotes.join(", ")}
                  placeholder="Select medical conditions"
                  onClick={handleNotesOpen}
                  sx={{
                    cursor: "pointer",
                  }}
                  inputProps={{
                    style: {
                      cursor: "pointer",
                    },
                  }}
                />

                <FormHelperText>
                  Select one or more medical conditions
                </FormHelperText>

                {/* DROPDOWN */}
                <Popover
                  open={Boolean(notesAnchor)}
                  anchorEl={notesAnchor}
                  onClose={handleNotesClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        width:
                          notesAnchor?.clientWidth ||
                          350,
                        maxHeight: 300,
                        overflowY: "auto",
                      },
                    },
                  }}
                >
                  {/* MENU LIST FIXES MUI ERROR */}
                  <MenuList>
                    {medicalOptions.map(
                      (option) => (
                        <MenuItem
                          key={option}
                          onClick={() =>
                            toggleMedicalNote(option)
                          }
                        >
                          <Checkbox
                            checked={selectedNotes.includes(
                              option
                            )}
                            sx={{
                              color: "#C9A227",
                              "&.Mui-checked": {
                                color: "#C9A227",
                              },
                            }}
                          />

                          <ListItemText
                            primary={option}
                          />
                        </MenuItem>
                      )
                    )}
                  </MenuList>
                </Popover>
              </FormControl>

              {/* ADDITIONAL MEDICAL NOTES */}
              <TextField
                label="Additional Medical Notes"
                multiline
                rows={4}
                fullWidth
                value={additionalNotes}
                onChange={
                  handleAdditionalNotesChange
                }
                helperText="Optional: write additional notes"
              />
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleEditClose}
            disabled={saving}
            sx={{
              borderColor: "#C9A227",
              color: "#C9A227",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={
              saving ||
              loadingEdit ||
              loadFailed
            }
            sx={{
              background: "#C9A227",
              fontWeight: 700,
              "&:hover": {
                background: "#b18c1f",
              },
            }}
          >
            {saving ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
