# Gesto

A page where an Author turns a Catalog recipe or a Sketch into one Spec, then copies that Spec to an agent to apply on a page they control.

## Language

**Author**:
The person who creates a Spec on Gesto and later names the Target on their own page.
_Avoid_: user, designer, student

**Catalog**:
The named list of Motions on the Gesto page. Each item emits a Spec.
_Avoid_: library, presets, gallery

**Sketch**:
The raw pointer samples recorded while the Author draws.
_Avoid_: drawing, recording, gesture, interpretation

**Cleanup**:
Smoothing the Sketch stroke, normalizing its timing, and closing it into a loop. Cleanup does not classify shapes.
_Avoid_: interpret, recognize, fix as a primitive

**Motion**:
The cleaned looping movement itself: path, duration, and loop.
_Avoid_: animation, tween, effect

**Spec**:
The portable, agent-readable description of one Motion. It never names a Target.
_Avoid_: prompt, recipe, export, code snippet

**Target**:
The element on the Author's page that should perform the Motion. The Author names it when they paste the Spec.
_Avoid_: selector, node, object (when you mean the page element)

**Copy to agent**:
The action that puts the Spec on the clipboard for an agent to apply.
_Avoid_: export, download, embed, plugin
