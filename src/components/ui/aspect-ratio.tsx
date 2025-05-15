
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

/**
 * AspectRatio Component
 * 
 * A wrapper around Radix UI's AspectRatio primitive
 * Used to maintain a specified aspect ratio for content (like images)
 * regardless of the width of the parent container
 * 
 * Example usage:
 * <AspectRatio ratio={16/9}>
 *   <img src="..." alt="..." />
 * </AspectRatio>
 */
const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
