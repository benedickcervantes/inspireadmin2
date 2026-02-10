"use client";

import { useState } from "react";
import { Modal, Button, Input, Form, Message, toaster } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Send: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Eye: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  AlertCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Image: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Upload: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
};

interface CustomEventsProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomEvents({ open, onClose }: CustomEventsProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isPosting, setIsPosting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toaster.push(
          <Message showIcon type="warning" closable>
            Please select a valid image file
          </Message>,
          { placement: "topEnd", duration: 3000 }
        );
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toaster.push(
          <Message showIcon type="warning" closable>
            Image size should be less than 5MB
          </Message>,
          { placement: "topEnd", duration: 3000 }
        );
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handlePost = async () => {
    if (!title.trim() || !description.trim()) {
      toaster.push(
        <Message showIcon type="warning" closable>
          Please fill in both title and description
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    setIsPosting(true);

    try {
      // Call API to post event
      const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4000";
      const token = localStorage.getItem("authToken");

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("postedAt", new Date().toISOString());
      
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to post event");
      }

      const result = await response.json();

      // Save to local event history for reference
      const event = {
        id: result.id || Date.now().toString(),
        title,
        description,
        imageUrl: result.imageUrl || imagePreview,
        postedAt: new Date().toISOString(),
        postedBy: "Admin",
      };

      const history = JSON.parse(localStorage.getItem("eventHistory") || "[]");
      history.unshift(event);
      localStorage.setItem("eventHistory", JSON.stringify(history.slice(0, 50)));

      setIsPosting(false);

      toaster.push(
        <Message showIcon type="success" closable>
          <div>
            <strong>Event posted successfully!</strong>
            <p className="text-xs mt-1">Event is now visible to all users</p>
          </div>
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );

      handleClose();
    } catch (error) {
      setIsPosting(false);

      const errorMessage = error instanceof Error ? error.message : "Failed to post event";

      toaster.push(
        <Message showIcon type="error" closable>
          <div>
            <strong>Failed to post event</strong>
            <p className="text-xs mt-1">{errorMessage}</p>
          </div>
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setShowPreview(false);
    onClose();
  };

  const characterCount = {
    title: title.length,
    description: description.length,
    titleMax: 100,
    descriptionMax: 500,
  };

  return (
    <Modal open={open} onClose={handleClose} size="md" className="dark-modal">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.Calendar className="w-5 h-5 text-[var(--accent)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Post Event
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
              <Icons.Users className="w-3 h-3" />
              Share event with all users
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          {/* Event Title */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Event Title
            </Form.ControlLabel>
            <Input
              value={title}
              onChange={setTitle}
              placeholder="Enter event title"
              maxLength={characterCount.titleMax}
              className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--accent)]"
            />
            <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1 flex justify-between">
              <span>Make it clear and descriptive</span>
              <span className={characterCount.title > characterCount.titleMax * 0.9 ? 'text-[var(--warning)]' : ''}>
                {characterCount.title}/{characterCount.titleMax}
              </span>
            </Form.HelpText>
          </Form.Group>

          {/* Event Description */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)]">
              Event Description
            </Form.ControlLabel>
            <Input
              as="textarea"
              rows={5}
              value={description}
              onChange={setDescription}
              placeholder="Enter event details and information"
              maxLength={characterCount.descriptionMax}
              className="!bg-[var(--surface-soft)] !text-[var(--text-primary)] !border-[var(--border)] focus:!border-[var(--accent)] !resize-none"
            />
            <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1 flex justify-between">
              <span>Provide detailed information about the event</span>
              <span className={characterCount.description > characterCount.descriptionMax * 0.9 ? 'text-[var(--warning)]' : ''}>
                {characterCount.description}/{characterCount.descriptionMax}
              </span>
            </Form.HelpText>
          </Form.Group>

          {/* Image Upload */}
          <Form.Group>
            <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)] mb-2">
              Event Image (Optional)
            </Form.ControlLabel>
            
            {!imagePreview ? (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent)] transition-colors bg-[var(--surface-soft)]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center">
                      <Icons.Upload className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Click to upload image
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-[var(--border)]">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--danger)] hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg"
                >
                  <Icons.X className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-xs text-white font-medium truncate">
                    {image?.name}
                  </p>
                </div>
              </div>
            )}
          </Form.Group>

          {/* Preview Toggle */}
          <div className="flex items-center justify-between p-3 bg-[var(--surface-soft)] rounded-lg border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Icons.Eye className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-secondary)]">Preview Event</span>
            </div>
            <Button
              size="xs"
              appearance="subtle"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!title.trim() && !description.trim()}
              className="!text-[var(--accent)]"
            >
              {showPreview ? "Hide" : "Show"}
            </Button>
          </div>

          {/* Preview */}
          {showPreview && (title.trim() || description.trim()) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border)] shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <Icons.Calendar className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    {title || "Event Title"}
                  </h4>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Event"
                      className="w-full h-32 object-cover rounded-lg my-2"
                    />
                  )}
                  <p className="text-xs text-[var(--text-secondary)] break-words whitespace-pre-wrap">
                    {description || "Event description will appear here"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Just now</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 p-3 bg-[var(--accent-soft)] border border-[var(--border-purple)] rounded-lg"
          >
            <Icons.AlertCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--accent)]">
              <strong>Note:</strong> This event will be posted to the events feed and visible to all users immediately.
            </div>
          </motion.div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="!bg-[var(--surface)] !border-t !border-[var(--border)] !pt-4 !pb-4">
        <div className="flex gap-3 justify-end mx-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleClose}
              appearance="subtle"
              disabled={isPosting}
              className="!text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handlePost}
              appearance="primary"
              loading={isPosting}
              disabled={!title.trim() || !description.trim()}
              className="!bg-gradient-to-r !from-[var(--accent)] !to-purple-500 hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icons.Send className="w-4 h-4" />
                Post Event
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
