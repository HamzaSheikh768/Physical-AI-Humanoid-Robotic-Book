# Custom Auth Navbar Item

This directory contains the theme extension for the custom authentication-aware navbar item.

## Files

- `CustomAuthNavbarItem.tsx` - A wrapper component that connects the AuthNavbarItem component to the Docusaurus theme system
- `../../theme/index.ts` - Registers the custom navbar item type with Docusaurus

## Purpose

The CustomAuthNavbarItem component serves as a bridge between the Docusaurus theme system and the authentication-aware component in `src/components/AuthNavbarItem`. This follows Docusaurus' recommended pattern for extending theme components.