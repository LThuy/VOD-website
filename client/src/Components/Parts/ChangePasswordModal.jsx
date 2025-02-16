import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../Style/Parts/modalChangePass.css";

const ChangePasswordModal = () => {
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [formData, setFormData] = useState({
    email: localStorage.getItem('userEmail'),
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  console.log(formData.email)

  const navigate = useNavigate(); // Moved outside

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateInput = () => {
    const { oldPassword, newPassword } = formData;

    if (!oldPassword.trim() || !newPassword.trim()) {
      toast.error("Password is required.");
      return false;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    return true; // Validation passed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Change Password failed");
      }

      const result = await response.json();
      toast.success(result.message || "Change Password Successfully!");

      // Remove "mustChangePassword" after successful update
      localStorage.removeItem("mustChangePassword");
      setMustChangePassword(false);

      // Navigate after success
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.message || "An error occurred during update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={mustChangePassword}
      backdrop="static"
      keyboard={false}
      centered
      className="custom-modal"
    >
      <Modal.Header>
        <Modal.Title className="fw-bold text-white">
          🔒 Change Your Password To Continue
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="oldPassword">
            <Form.Label className="fw-semibold text-white">
              Old Password
            </Form.Label>
            <Form.Control
              type="password"
              name="oldPassword"
              placeholder="Enter your old password"
              value={formData.oldPassword}
              onChange={handleInputChange}
              required
              className="rounded-3 p-2"
            />
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.Label className="fw-semibold text-white mt-2">
              New Password
            </Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              placeholder="Enter a new password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              className="rounded-3 p-2"
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-4">
            <Button type="submit" variant="success" className="rounded-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
