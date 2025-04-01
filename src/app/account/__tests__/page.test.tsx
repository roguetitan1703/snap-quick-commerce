import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountPage from "../page";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} />;
  },
}));

// Mock next/link
jest.mock("next/link", ({ children, ...props }: any) => {
  return <a {...props}>{children}</a>;
});

describe("AccountPage", () => {
  it("renders user profile information", () => {
    render(<AccountPage />);

    expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    expect(screen.getByText("alex.johnson@example.com")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders all navigation sections", () => {
    render(<AccountPage />);

    expect(screen.getByText("My Account")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    render(<AccountPage />);

    // My Account section
    expect(screen.getByText("My Orders")).toBeInTheDocument();
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Payment Methods")).toBeInTheDocument();
    expect(screen.getByText("Addresses")).toBeInTheDocument();

    // Settings section
    expect(screen.getByText("App Settings")).toBeInTheDocument();
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Privacy & Security")).toBeInTheDocument();

    // Support section
    expect(screen.getByText("Help Center")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("toggles dark mode when toggle button is clicked", () => {
    render(<AccountPage />);

    // Get toggle button by finding its parent (using Dark Mode text)
    const darkModeText = screen.getByText("Dark Mode");
    const toggleButton = darkModeText.closest("div")?.querySelector("button");

    // Toggle should initially be off
    expect(toggleButton).toHaveClass("bg-gray-300");
    expect(toggleButton).not.toHaveClass("bg-blue-600");

    // Click toggle button
    if (toggleButton) {
      fireEvent.click(toggleButton);
    }

    // Toggle should now be on
    expect(toggleButton).toHaveClass("bg-blue-600");
    expect(toggleButton).not.toHaveClass("bg-gray-300");
  });

  it("displays app version", () => {
    render(<AccountPage />);
    expect(screen.getByText("Snap Quick Commerce v1.0.0")).toBeInTheDocument();
  });
});
