# socket-party

todo

## Requirements

1. Bun v1.3.3+
2. Playwright
   ```bash
   bunx playwright install-deps
   bunx playwright@latest install
   ```

## Setup

1. Install depenedencies

   ```bash
   bun install
   ```

2. Install sst tunnel for VPC connection (using "PATH" reference to solve non-sudo bun install)
   ```bash
   sudo env "PATH=$PATH" bun sst tunnel install
   ```
