
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Collapsible Component
 * 
 * A wrapper around Radix UI's Collapsible primitive
 * Used to create expandable/collapsible sections
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * CollapsibleTrigger Component
 * 
 * The interactive element that toggles the collapsible content
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * CollapsibleContent Component
 * 
 * The content that is shown/hidden when the collapsible is toggled
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
