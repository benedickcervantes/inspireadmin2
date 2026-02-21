import { useState } from "react";
import {
  Drawer,
  Button,
  Tag,
  Input,
  SelectPicker,
  Panel,
  Divider,
  Message,
  toaster,
} from "rsuite";
import { updateTicket, addMessage, type Ticket } from "@/lib/api/tickets";

interface TicketDetailDrawerProps {
  open: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function TicketDetailDrawer({
  open,
  ticket,
  onClose,
  onUpdate,
}: TicketDetailDrawerProps) {
  const [updating, setUpdating] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [notes, setNotes] = useState("");
  const [resolution, setResolution] = useState("");

  if (!ticket) return null;

  const statusOptions = [
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in-progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const handleUpdateStatus = async (status: string) => {
    try {
      setUpdating(true);
      await updateTicket(ticket.id, ticket.userId, { status });
      
      toaster.push(
        <Message showIcon type="success">
          Status updated successfully
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toaster.push(
        <Message showIcon type="error">
          {error.message || "Failed to update status"}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePriority = async (priority: string) => {
    try {
      setUpdating(true);
      await updateTicket(ticket.id, ticket.userId, { priority });
      
      toaster.push(
        <Message showIcon type="success">
          Priority updated successfully
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      
      onUpdate();
    } catch (error: any) {
      toaster.push(
        <Message showIcon type="error">
          {error.message || "Failed to update priority"}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      await addMessage(ticket.id, ticket.userId, newMessage);
      
      toaster.push(
        <Message showIcon type="success">
          Message sent successfully
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      
      setNewMessage("");
      onUpdate();
    } catch (error: any) {
      toaster.push(
        <Message showIcon type="error">
          {error.message || "Failed to send message"}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setUpdating(true);
      await updateTicket(ticket.id, ticket.userId, { notes });
      
      toaster.push(
        <Message showIcon type="success">
          Notes saved successfully
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      
      onUpdate();
    } catch (error: any) {
      toaster.push(
        <Message showIcon type="error">
          {error.message || "Failed to save notes"}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution.trim()) {
      toaster.push(
        <Message showIcon type="warning">
          Please provide a resolution before resolving the ticket
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    try {
      setUpdating(true);
      await updateTicket(ticket.id, ticket.userId, {
        status: "resolved",
        resolution,
      });
      
      toaster.push(
        <Message showIcon type="success">
          Ticket resolved successfully
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toaster.push(
        <Message showIcon type="error">
          {error.message || "Failed to resolve ticket"}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setUpdating(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "blue";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "blue";
      case "in-progress":
        return "orange";
      case "resolved":
        return "green";
      case "closed":
        return "gray";
      default:
        return "blue";
    }
  };

  return (
    <Drawer size="lg" open={open} onClose={onClose} closeButton={false}>
      <Drawer.Header>
        <Drawer.Title>Ticket Details</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <div className="space-y-6">
          {/* Ticket Info */}
          <Panel bordered>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              {ticket.title}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-muted)]">Status:</span>
                <Tag color={getStatusColor(ticket.status)}>{ticket.status}</Tag>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-muted)]">Priority:</span>
                <Tag color={getPriorityColor(ticket.priority)}>{ticket.priority}</Tag>
              </div>

              <div>
                <span className="text-sm font-medium text-[var(--text-muted)]">Description:</span>
                <p className="text-sm text-[var(--text-primary)] mt-1">{ticket.description}</p>
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-[var(--text-muted)]">Customer:</span>
                  <p className="text-[var(--text-primary)]">{ticket.customerName}</p>
                </div>
                <div>
                  <span className="font-medium text-[var(--text-muted)]">Email:</span>
                  <p className="text-[var(--text-primary)]">{ticket.customerEmail}</p>
                </div>
                <div>
                  <span className="font-medium text-[var(--text-muted)]">Category:</span>
                  <p className="text-[var(--text-primary)]">{ticket.category}</p>
                </div>
                <div>
                  <span className="font-medium text-[var(--text-muted)]">Assigned To:</span>
                  <p className="text-[var(--text-primary)]">{ticket.assignedTo}</p>
                </div>
                <div>
                  <span className="font-medium text-[var(--text-muted)]">Created:</span>
                  <p className="text-[var(--text-primary)]">{formatDateTime(ticket.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-[var(--text-muted)]">Updated:</span>
                  <p className="text-[var(--text-primary)]">{formatDateTime(ticket.updatedAt)}</p>
                </div>
              </div>
            </div>
          </Panel>

          {/* Update Status & Priority */}
          <Panel bordered header="Update Ticket">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">
                  Change Status
                </label>
                <SelectPicker
                  data={statusOptions}
                  value={ticket.status}
                  onChange={(value) => value && handleUpdateStatus(value)}
                  block
                  disabled={updating}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">
                  Change Priority
                </label>
                <SelectPicker
                  data={priorityOptions}
                  value={ticket.priority}
                  onChange={(value) => value && handleUpdatePriority(value)}
                  block
                  disabled={updating}
                />
              </div>
            </div>
          </Panel>

          {/* Messages */}
          <Panel bordered header="Conversation">
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.isCustomer
                        ? "bg-blue-50 dark:bg-blue-950/20"
                        : "bg-gray-50 dark:bg-gray-900/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {msg.sender}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatDateTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)]">{msg.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">
                  No messages yet
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                as="textarea"
                rows={3}
                placeholder="Type your message..."
                value={newMessage}
                onChange={setNewMessage}
              />
              <Button
                appearance="primary"
                color="blue"
                onClick={handleSendMessage}
                loading={sendingMessage}
                disabled={!newMessage.trim()}
              >
                Send Message
              </Button>
            </div>
          </Panel>

          {/* Notes */}
          <Panel bordered header="Internal Notes">
            <div className="space-y-2">
              <Input
                as="textarea"
                rows={4}
                placeholder="Add internal notes (not visible to customer)..."
                value={notes || ticket.notes}
                onChange={setNotes}
              />
              <Button
                appearance="primary"
                onClick={handleSaveNotes}
                loading={updating}
              >
                Save Notes
              </Button>
            </div>
          </Panel>

          {/* Resolution */}
          {ticket.status !== "resolved" && ticket.status !== "closed" && (
            <Panel bordered header="Resolve Ticket">
              <div className="space-y-2">
                <Input
                  as="textarea"
                  rows={4}
                  placeholder="Describe how this ticket was resolved..."
                  value={resolution || ticket.resolution}
                  onChange={setResolution}
                />
                <Button
                  appearance="primary"
                  color="green"
                  onClick={handleResolve}
                  loading={updating}
                >
                  Mark as Resolved
                </Button>
              </div>
            </Panel>
          )}

          {ticket.resolution && (
            <Panel bordered header="Resolution">
              <p className="text-sm text-[var(--text-primary)]">{ticket.resolution}</p>
              {ticket.resolvedAt && (
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Resolved on {formatDateTime(ticket.resolvedAt)}
                </p>
              )}
            </Panel>
          )}
        </div>
      </Drawer.Body>
    </Drawer>
  );
}
