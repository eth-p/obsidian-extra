import { Events, App as ObsidianApp, Plugin } from 'obsidian';

import getFloatingWindows from './getFloatingWindows';

const Counter = Symbol('CustomStylesheet count');

export type CustomStyleSheet = {
	(): void;

	get css(): string;
	set css(text: string);

	setAttribute(attr: string, value: string): void;
	removeAttribute(attr: string): void;

	is(el: HTMLElement): boolean;
};

function foreachWindow(app: ObsidianApp, fn: (document: Document, isFloating: boolean) => void) {
	fn(app.workspace.containerEl.doc, true);
	for (const float of getFloatingWindows(app)) {
		fn(float.document, false);
	}
}

/**
 * Creates a custom stylesheet that is applied at runtime.
 * It will apply to all floating windows and is automatically removed when your plugin is unloaded.
 * 
 * @param app The app instance.
 * @param plugin Your plugin instance.
 *
 * @returns A controller to manipulate the style sheet and its associated `<style>` element.
 */
export default function createCustomStyleSheet(app: ObsidianApp, plugin: Plugin) {
	let result: CustomStyleSheet;
	const pl = plugin as Plugin & { [Counter]?: number };
	const plId = plugin.manifest.id;
	const ssId = (pl[Counter] ?? (pl[Counter] = 0)).toString();
	pl[Counter]++;

	const styleEl: HTMLStyleElement = app.workspace.containerEl.doc.createElement('style');
	const styleElInFloats: HTMLStyleElement[] = [];

	// Set attributes for the style element.
	styleEl.setAttribute('data-source-plugin', plId);
	styleEl.setAttribute('data-source-id', ssId);

	// Functions.
	function unapply() {
		styleElInFloats.splice(0, styleElInFloats.length).forEach((el) => el.remove());
		styleEl.detach();

		foreachWindow(app, (doc) => {
			for (const styleEl of Array.from(doc.head.querySelectorAll('style'))) {
				if (result.is(styleEl)) {
					styleEl.remove();
				}
			}
		});
	}

	function reapply() {
		unapply();
		foreachWindow(app, (doc, isFloating) => {
			// Get the last style element.
			let lastEl = doc.head.lastElementChild;
			for (let el = lastEl; el != null; el = el.previousElementSibling) {
				lastEl = el;
				if (lastEl.tagName === 'STYLE') {
					break;
				}
			}

			// Insert the stylesheet after it.
			if (!isFloating) {
				lastEl?.insertAdjacentElement('afterend', styleEl);
				return;
			}

			// If it's a floating window, insert a clone.
			const styleElClone = styleEl.cloneNode(true) as HTMLStyleElement;
			styleElInFloats.push(styleElClone);
			lastEl?.insertAdjacentElement('afterend', styleElClone);
		});
	}

	// Start listening for changes that might affect the `<style>` elements in the document head.
	app.workspace.on('css-change', reapply);
	app.workspace.on('layout-change', reapply);

	// Create the custom stylesheet object.
	result = Object.freeze(Object.defineProperties(
		() => {
			unapply();
			app.workspace.off('css-change', reapply);
			app.workspace.off('layout-change', reapply);
		},
		{
			css: {
				enumerable: true,
				configurable: false,
				get() {
					return styleEl.textContent;
				},
				set(v) {
					styleEl.textContent = v;
					for (const styleEl of styleElInFloats) {
						styleEl.textContent = v;
					}
				},
			},

			is: {
				enumerable: false,
				configurable: false,
				value: (el: HTMLElement) => {
					return el.getAttribute('data-source-plugin') === plId && el.getAttribute('data-source-id') === ssId;
				},
			},

			setAttribute: {
				enumerable: false,
				configurable: false,
				value: (attr: string, value: string) => {
					if (attr === 'data-source-id' || attr === 'data-source-plugin') {
						throw new Error(`Cannot change attribute '${attr}' on custom style sheet.`);
					}

					styleEl.setAttribute(attr, value);
					for (const styleEl of styleElInFloats) {
						styleEl.setAttribute(attr, value);
					}
				},
			},

			removeAttribute: {
				enumerable: false,
				configurable: false,
				value: (attr: string) => {
					if (attr === 'data-source-id' || attr === 'data-source-plugin') {
						throw new Error(`Cannot remove attribute '${attr}' from custom style sheet.`);
					}

					styleEl.removeAttribute(attr);
					for (const styleEl of styleElInFloats) {
						styleEl.removeAttribute(attr);
					}
				},
			},
		},
	) as CustomStyleSheet);

	// Apply.
	reapply();
	return result;
}
