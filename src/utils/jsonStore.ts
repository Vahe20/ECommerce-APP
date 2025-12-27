import fs from "node:fs";
import path from "node:path";

class JsonStore<T extends { id: string }> {
	private filePath: string;

	constructor(filename: string) {
		this.filePath = path.join(process.cwd(), "src", "data", filename);
		this.initFile();
	}

	private initFile(): void {
		try {
			const dir = path.dirname(this.filePath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			if (!fs.existsSync(this.filePath)) {
				fs.writeFileSync(this.filePath, "[]", "utf-8");
			}
		} catch (error) {
			console.error(`Error initializing file ${this.filePath}:`, error);
			throw new Error("Failed to initialize JSON store");
		}
	}

	readAll(): T[] {
		try {
			const data = fs.readFileSync(this.filePath, "utf-8");
			return JSON.parse(data) as T[];
		} catch (error) {
			console.error(`Error reading file ${this.filePath}:`, error);
			return [];
		}
	}

	findById(id: string): T | null {
		const items = this.readAll();
		return items.find(item => item.id === id) || null;
	}

	find(predicate: (item: T) => boolean): T[] {
		const items = this.readAll();
		return items.filter(predicate);
	}

	findOne(predicate: (item: T) => boolean): T | null {
		const items = this.readAll();
		return items.find(predicate) || null;
	}

	private writeAll(data: T[]): void {
		try {
			fs.writeFileSync(
				this.filePath,
				JSON.stringify(data, null, 2),
				"utf-8"
			);
		} catch (error) {
			console.error(`Error writing to file ${this.filePath}:`, error);
			throw new Error("Failed to write to JSON store");
		}
	}

	create(item: T): T {
		const items = this.readAll();

		if (items.some(existing => existing.id === item.id)) {
			throw new Error(`Item with id ${item.id} already exists`);
		}

		items.push(item);
		this.writeAll(items);
		return item;
	}

	update(id: string, updates: Partial<Omit<T, "id">>): T | null {
		const items = this.readAll();
		const index = items.findIndex(item => item.id === id);

		if (index === -1) {
			return null;
		}

		items[index] = { ...items[index], ...updates };
		this.writeAll(items);
		return items[index];
	}

	delete(id: string): boolean {
		const items = this.readAll();
		const filtered = items.filter(item => item.id !== id);

		if (filtered.length === items.length) {
			return false;
		}

		this.writeAll(filtered);
		return true;
	}

	clear(): void {
		this.writeAll([]);
	}


	exists(id: string): boolean {
		return this.findById(id) !== null;
	}
}

export default JsonStore;
