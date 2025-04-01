import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

// Mock the ProductCard component
jest.mock("../../components/product/ProductCard", () => {
  return function MockProductCard(props: any) {
    return (
      <div data-testid="product-card">
        {props.name} - ${props.price}
      </div>
    );
  };
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock next/link for testing
jest.mock("next/link", ({ children, ...rest }: any) => {
  return <a {...rest}>{children}</a>;
});

describe("HomePage", () => {
  it("renders home page with search bar", () => {
    render(<HomePage />);

    // Check for search bar
    expect(screen.getByText("Search products...")).toBeInTheDocument();
  });

  it("renders main promotional banner", () => {
    render(<HomePage />);

    expect(screen.getByText("Shop quickly,")).toBeInTheDocument();
    expect(screen.getByText("Get it delivered faster!")).toBeInTheDocument();
    expect(screen.getByText("Shop Now")).toBeInTheDocument();
  });

  it("renders feature icons section", () => {
    render(<HomePage />);

    expect(screen.getByText("Free Delivery")).toBeInTheDocument();
    expect(screen.getByText("Quick Delivery")).toBeInTheDocument();
    expect(screen.getByText("Special Offers")).toBeInTheDocument();
  });

  it("renders categories section", () => {
    render(<HomePage />);

    expect(screen.getByText("Categories")).toBeInTheDocument();

    // Check for category names
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders featured products section with ProductCard components", () => {
    render(<HomePage />);

    expect(screen.getByText("Featured Products")).toBeInTheDocument();

    // Check if ProductCard components are rendered
    const productCards = screen.getAllByTestId("product-card");
    expect(productCards.length).toBe(4); // We have 4 featured products
  });

  it("renders sign up promo banner", () => {
    render(<HomePage />);

    expect(screen.getByText("Sign up & get 10% off")).toBeInTheDocument();
    expect(
      screen.getByText("Join our community for exclusive deals")
    ).toBeInTheDocument();
    expect(screen.getByText("Sign Up Now")).toBeInTheDocument();
  });
});
