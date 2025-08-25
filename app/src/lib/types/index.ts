// Core application types for PRADISTI

export interface User {
	id: string;
	email: string;
	name?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Common form validation types
export interface FormField {
	value: string;
	error?: string;
	touched?: boolean;
}

export interface ValidationRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	custom?: (value: string) => boolean | string;
}