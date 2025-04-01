import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../ProductCard";

// Mock the useCartStore hook
jest.mock("../../../store/cartStore", () => ({
  useCartStore: jest.fn().mockImplementation(() => ({
    addItem: jest.fn(),
  })),
}));

describe("ProductCard", () => {
  const mockProps = {
    id: "1",
    name: "Test Product",
    price: 99.99,
    imageUrl: "https://example.com/image.jpg",
    category: "Electronics",
    currentStock: 10,
  };

  it("renders product information correctly", () => {
    render(<ProductCard {...mockProps} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
  });

  it('displays "NEW" badge when isNew prop is true', () => {
    render(<ProductCard {...mockProps} isNew={true} />);

    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("displays discount badge and calculated price when discount prop is provided", () => {
    render(<ProductCard {...mockProps} discount={20} />);

    // Original price: $99.99, 20% discount = $79.99
    expect(screen.getByText("-20%")).toBeInTheDocument();
    expect(screen.getByText("$79.99")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument(); // Original price is displayed with strikethrough
  });

  it("shows out of stock overlay when currentStock is 0", () => {
    render(<ProductCard {...mockProps} currentStock={0} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("calls addItem when add to cart button is clicked", () => {
    const { useCartStore } = require("../../../store/cartStore");
    const addItemMock = jest.fn();
    useCartStore.mockImplementation(() => ({
      addItem: addItemMock,
    }));

    render(<ProductCard {...mockProps} />);

    // Find the add to cart button by its aria-label
    const addToCartButton = screen.getByLabelText("Add to cart");
    fireEvent.click(addToCartButton);

    expect(addItemMock).toHaveBeenCalledTimes(1);
    expect(addItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: "1",
        name: "Test Product",
        price: 99.99,
        quantity: 1,
      })
    );
  });

  it("does not call addItem when button is clicked and product is out of stock", () => {
    const { useCartStore } = require("../../../store/cartStore");
    const addItemMock = jest.fn();
    useCartStore.mockImplementation(() => ({
      addItem: addItemMock,
    }));

    render(<ProductCard {...mockProps} currentStock={0} />);

    const addToCartButton = screen.getByLabelText("Add to cart");
    fireEvent.click(addToCartButton);

    expect(addItemMock).not.toHaveBeenCalled();
  });
});
