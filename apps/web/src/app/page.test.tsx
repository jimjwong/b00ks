import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LandingPage from "./page";

describe("LandingPage", () => {
  it("shows the product tagline and primary action", () => {
    render(<LandingPage />);
    expect(screen.getByText("Your books. Every device.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create your library" })).toBeInTheDocument();
  });
});
