"use client"

import * as React from "react"

import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { highlightCode } from "@/lib/code-highlighters"
import { cn } from "@/lib/utils"

const COLLAPSE_THRESHOLD = 20
const COPY_TIMEOUT = 2000
const VISIBLE_LINES = 10

export interface CodeBlockProps {
  title?: string
  titleClassName?: string
  titleIcon?: React.ReactNode
  code: string | Record<string, string>
  language?: string
  isCollapsible?: boolean
  collapseThreshold?: number
  visibleLines?: number
  defaultTab?: string
  className?: string
}

interface CodeContentProps {
  code: string
  language: string
  isOpen: boolean
  shouldCollapse: boolean
  visibleLines: number
  onCopy: (text: string) => void
  copied: boolean
  preRef: (el: HTMLPreElement | null) => void
}

const useCopyToClipboard = () => {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = React.useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_TIMEOUT)
  }, [])

  const resetCopied = React.useCallback(() => {
    setCopied(false)
  }, [])

  return { copied, copyToClipboard, resetCopied }
}

const useScrollReset = (isOpen: boolean) => {
  const preRefs = React.useRef<(HTMLPreElement | null)[]>([])

  React.useEffect(() => {
    if (!isOpen) {
      preRefs.current.forEach((pre) => {
        if (pre) {
          pre.scrollLeft = 0
        }
      })
    }
  }, [isOpen])

  return preRefs
}

const countLines = (str: string): number => str.split("\n").length

const getVisibleCode = (codeStr: string, lines: number): string => {
  return codeStr.split("\n").slice(0, lines).join("\n")
}

const CopyButton: React.FC<{
  onCopy: () => void
  copied: boolean
}> = ({ onCopy, copied }) => (
  <TooltipProvider>
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground hover:bg-transparent dark:hover:bg-transparent z-20"
          onClick={onCopy}
        >
          {copied ? <Check className="text-success" /> : <Copy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>
        <p>In Zwischenablage kopieren</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const CodeHeader: React.FC<{
  title?: string
  titleClassName?: string
  titleIcon?: React.ReactNode
}> = ({ title, titleClassName, titleIcon }) => {
  if (!title) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b min-h-[3rem]">
      <div
        className={cn("font-medium flex items-center gap-2", titleClassName)}
      >
        {titleIcon && <span className="flex-shrink-0">{titleIcon}</span>}
        <span>{title}</span>
      </div>
    </div>
  )
}

const CodeContent: React.FC<CodeContentProps> = ({
  code,
  language,
  isOpen,
  shouldCollapse,
  visibleLines,
  onCopy,
  copied,
  preRef,
}) => {
  const displayCode =
    !isOpen && shouldCollapse ? getVisibleCode(code, visibleLines) : code

  const shouldTruncate = !isOpen && shouldCollapse

  return (
    <div className="relative group">
      <pre
        ref={preRef}
        className={cn(
          "p-4 pr-12 overflow-x-auto text-sm",
          shouldTruncate ? "overflow-hidden" : "overflow-auto",
        )}
      >
        <code
          dangerouslySetInnerHTML={{
            __html: highlightCode(displayCode, language),
          }}
        />
      </pre>
      <CopyButton onCopy={() => onCopy(code)} copied={copied} />
    </div>
  )
}

const CollapsibleCodeBlock: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  shouldCollapse: boolean
}> = ({ children, isOpen, onOpenChange, shouldCollapse }) => (
  <Collapsible open={!shouldCollapse || isOpen} onOpenChange={onOpenChange}>
    <CollapsibleContent forceMount className="relative">
      {children}
      {!isOpen && shouldCollapse && (
        <div className="absolute h-32 bottom-0 left-2 right-2 bg-gradient-to-t from-muted to-transparent rounded-b-lg z-10" />
      )}
    </CollapsibleContent>
    {shouldCollapse && (
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-8 px-3 mb-2 text-muted-foreground hover:text-foreground hover:bg-transparent dark:hover:bg-transparent z-10"
        >
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CollapsibleTrigger>
    )}
  </Collapsible>
)

export function CodeBlock({
  title,
  titleClassName,
  titleIcon,
  code,
  language = "cli",
  isCollapsible = true,
  collapseThreshold = COLLAPSE_THRESHOLD,
  visibleLines = VISIBLE_LINES,
  defaultTab,
  className,
}: CodeBlockProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { copied, copyToClipboard, resetCopied } = useCopyToClipboard()
  const preRefs = useScrollReset(isOpen)

  const isMultiple = typeof code === "object"
  const codeVersions = isMultiple
    ? Object.entries(code)
    : [["default", code as string]]
  const defaultVersion =
    defaultTab || (isMultiple ? codeVersions[0][0] : "default")

  const shouldCollapse =
    isCollapsible &&
    codeVersions.some(([_, codeStr]) => countLines(codeStr) > collapseThreshold)

  const handleCopy = React.useCallback(
    (text: string) => {
      copyToClipboard(text)
    },
    [copyToClipboard],
  )

  const handleTabChange = React.useCallback(() => {
    if (copied) {
      resetCopied()
    }
  }, [copied, resetCopied])

  if (isMultiple) {
    return (
      <div className={cn("relative", className)}>
        <Tabs defaultValue={defaultVersion} className="w-full">
          <TabsList className="mb-2">
            {codeVersions.map(([version]) => (
              <TabsTrigger
                key={version}
                value={version}
                onClick={handleTabChange}
              >
                {version}
              </TabsTrigger>
            ))}
          </TabsList>

          {codeVersions.map(([version, codeStr], index) => (
            <TabsContent key={version} value={version} className="mt-0">
              <div className="rounded-lg border bg-muted">
                <CodeHeader
                  title={title}
                  titleClassName={titleClassName}
                  titleIcon={titleIcon}
                />
                <CollapsibleCodeBlock
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                  shouldCollapse={shouldCollapse}
                >
                  <CodeContent
                    code={codeStr}
                    language={language}
                    isOpen={isOpen}
                    shouldCollapse={shouldCollapse}
                    visibleLines={visibleLines}
                    onCopy={handleCopy}
                    copied={copied}
                    preRef={(el) => {
                      preRefs.current[index] = el
                    }}
                  />
                </CollapsibleCodeBlock>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <div className="rounded-lg border bg-muted">
        <CodeHeader
          title={title}
          titleClassName={titleClassName}
          titleIcon={titleIcon}
        />
        <CollapsibleCodeBlock
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          shouldCollapse={shouldCollapse}
        >
          <CodeContent
            code={code as string}
            language={language}
            isOpen={isOpen}
            shouldCollapse={shouldCollapse}
            visibleLines={visibleLines}
            onCopy={handleCopy}
            copied={copied}
            preRef={(el) => {
              preRefs.current[0] = el
            }}
          />
        </CollapsibleCodeBlock>
      </div>
    </div>
  )
}
