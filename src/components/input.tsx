'use client'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps, CSSProperties } from 'react'

export const inputVariants = tv({
	base: [
		'w-full rounded-full border-2 border-transparent bg-input px-6 text-foreground placeholder:text-muted-foreground transition-colors',
		'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		'data-[error]:border-red-500 data-[error]:focus:ring-red-500',
	],
	variants: {
		variant: {
			default: 'bg-input text-foreground placeholder:text-muted-foreground',
			custom: [
				'bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)]',
			],
		},
		inputSize: {
			sm: 'h-10 text-sm',
			md: 'h-12 text-base',
			lg: 'h-14 text-lg',
		},
	},
	defaultVariants: { variant: 'default', inputSize: 'md' },
})

export interface InputCustomColors {
	bg: string
	text: string
	placeholder?: string
}

export interface InputProps
	extends Omit<ComponentProps<'input'>, 'size'>,
		VariantProps<typeof inputVariants> {
	label?: string
	customColors?: InputCustomColors
	error?: string
}

function getCustomColorStyles(colors: InputCustomColors): CSSProperties {
	return {
		'--input-bg': colors.bg,
		'--input-text': colors.text,
		'--input-placeholder': colors.placeholder ?? colors.text,
	} as CSSProperties
}

export function Input({
	className,
	variant,
	inputSize,
	label,
	disabled,
	style,
	customColors,
	id,
	error,
	required,
	...props
}: InputProps) {
	const finalVariant = customColors ? 'custom' : variant
	const customStyles = customColors ? getCustomColorStyles(customColors) : {}
	const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

	if (label) {
		return (
			<div data-slot="input-wrapper" className="flex flex-col gap-2">
				<label
					htmlFor={inputId}
					data-slot="input-label"
					className="text-base font-medium text-foreground"
				>
					{label}
					{required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
				</label>
				<input
					id={inputId}
					data-slot="input"
					data-disabled={disabled ? '' : undefined}
					data-error={error ? '' : undefined}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={error ? `${inputId}-error` : undefined}
					className={twMerge(inputVariants({ variant: finalVariant, inputSize }), className)}
					style={{ ...customStyles, ...style }}
					disabled={disabled}
					required={required}
					{...props}
				/>
				{error && (
					<span
						id={`${inputId}-error`}
						data-slot="input-error"
						className="text-sm text-error"
					>
						{error}
					</span>
				)}
			</div>
		)
	}

	return (
		<input
			id={inputId}
			data-slot="input"
			data-disabled={disabled ? '' : undefined}
			data-error={error ? '' : undefined}
			aria-invalid={error ? 'true' : undefined}
			className={twMerge(inputVariants({ variant: finalVariant, inputSize }), className)}
			style={{ ...customStyles, ...style }}
			disabled={disabled}
			required={required}
			{...props}
		/>
	)
}
