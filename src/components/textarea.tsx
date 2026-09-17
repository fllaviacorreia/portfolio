'use client'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps, CSSProperties } from 'react'

export const textareaVariants = tv({
	base: [
		'w-full rounded-3xl border-2 border-transparent bg-theme-800 px-6 py-4 text-foreground placeholder:text-theme-600 transition-colors resize-none',
		'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		'data-[error]:border-red-500 data-[error]:focus:ring-red-500',
	],
	variants: {
		variant: {
			default: 'bg-theme-800 text-foreground placeholder:text-theme-600',
			custom: [
				'bg-[var(--textarea-bg)] text-[var(--textarea-text)] placeholder:text-[var(--textarea-placeholder)]',
			],
		},
		textareaSize: {
			sm: 'min-h-24 text-sm',
			md: 'min-h-32 text-base',
			lg: 'min-h-44 text-lg',
		},
	},
	defaultVariants: { variant: 'default', textareaSize: 'md' },
})

export interface TextareaCustomColors {
	bg: string
	text: string
	placeholder?: string
}

export interface TextareaProps
	extends ComponentProps<'textarea'>,
		VariantProps<typeof textareaVariants> {
	label?: string
	customColors?: TextareaCustomColors
	error?: string
}

function getCustomColorStyles(colors: TextareaCustomColors): CSSProperties {
	return {
		'--textarea-bg': colors.bg,
		'--textarea-text': colors.text,
		'--textarea-placeholder': colors.placeholder ?? colors.text,
	} as CSSProperties
}

export function Textarea({
	className,
	variant,
	textareaSize,
	label,
	disabled,
	style,
	customColors,
	id,
	error,
	required,
	...props
}: TextareaProps) {
	const finalVariant = customColors ? 'custom' : variant
	const customStyles = customColors ? getCustomColorStyles(customColors) : {}
	const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

	if (label) {
		return (
			<div data-slot="textarea-wrapper" className="flex flex-col gap-2">
				<label
					htmlFor={textareaId}
					data-slot="textarea-label"
					className="text-lg font-medium text-foreground"
				>
					{label}
					{required && <span className="ml-1 text-red-500">*</span>}
				</label>
				<textarea
					id={textareaId}
					data-slot="textarea"
					data-disabled={disabled ? '' : undefined}
					data-error={error ? '' : undefined}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={error ? `${textareaId}-error` : undefined}
					className={twMerge(textareaVariants({ variant: finalVariant, textareaSize }), className)}
					style={{ ...customStyles, ...style }}
					disabled={disabled}
					required={required}
					{...props}
				/>
				{error && (
					<span
						id={`${textareaId}-error`}
						data-slot="textarea-error"
						className="text-sm text-red-500"
					>
						{error}
					</span>
				)}
			</div>
		)
	}

	return (
		<textarea
			id={textareaId}
			data-slot="textarea"
			data-disabled={disabled ? '' : undefined}
			data-error={error ? '' : undefined}
			aria-invalid={error ? 'true' : undefined}
			className={twMerge(textareaVariants({ variant: finalVariant, textareaSize }), className)}
			style={{ ...customStyles, ...style }}
			disabled={disabled}
			required={required}
			{...props}
		/>
	)
}
