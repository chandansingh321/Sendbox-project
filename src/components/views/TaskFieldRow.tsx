import React, { useState } from 'react'
import type { TaskField } from '../../types/review'
import { useReview } from '../../context/ReviewContext'
import { DecisionControls } from './DecisionControls'
import { ChevronDown } from 'lucide-react'

interface TaskFieldRowProps {
  taskId: string
  field: TaskField
  readOnly?: boolean
}

export const TaskFieldRow: React.FC<TaskFieldRowProps> = ({ taskId, field, readOnly = false }) => {
  const { highlightMissing, rowNeedsChoice } = useReview()
  const [expanded, setExpanded] = useState(false)

  const labelText = field.label || field.path.split('/').filter(Boolean).pop() || 'Field'
  const pathText = field.path.startsWith('/') ? field.path : `/${field.path}`
  const descriptionText =
    field.description ||
    `Detailed information about '${labelText}'. No additional notes detected.`

  const isMissing = highlightMissing && rowNeedsChoice(field)
  const isMissingReason = highlightMissing && field.decision === 'no_action' && !field.reason?.trim()
  const isMissingDecision = highlightMissing && !field.decision

  return (
    <div
      className={`border-b border-gray-200 row-group bg-white transition-colors ${
        isMissing ? 'ring-2 ring-rose-400/90 bg-rose-50/20' : ''
      }`}
    >
      {/* Purple-tinted row header with label and path */}
      <div className="px-3.5 sm:px-4 py-2 bg-[#f7f2fc] text-xs border-b border-gray-200 flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-gray-700">{labelText}</span>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-gray-500 underline decoration-gray-300 hover:text-gray-700 text-xs font-mono break-all"
          >
            {pathText}
          </a>
        </div>

        {isMissingDecision && (
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">
            Decision required
          </span>
        )}
        {isMissingReason && (
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">
            Reason required
          </span>
        )}
      </div>

      {/* Row Columns (35% Current, 35% Proposed, Separator, 30% Decision on md+; stacked on mobile) */}
      <div className="flex min-h-[60px] items-stretch flex-col md:flex-row">
        {/* Current Column */}
        <div className="w-full md:w-[35%] px-3.5 sm:px-4 py-3 sm:py-4 text-sm text-gray-800 break-words">
          <div className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Current
          </div>
          {field.current || <span className="text-gray-400 italic">—</span>}
        </div>

        {/* Proposed Column */}
        <div className="w-full md:w-[35%] px-3.5 sm:px-4 py-3 sm:py-4 text-sm text-gray-800 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50/20 break-words">
          <div className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Proposed
          </div>
          {field.proposed || <span className="text-gray-400 italic">—</span>}
        </div>

        {/* Dotted Separator (desktop only) */}
        <div className="hidden md:block decision-separator"></div>

        {/* Decision Column */}
        <div className="w-full md:w-[30%] px-3.5 sm:px-4 py-3 border-t md:border-t-0 border-gray-200 flex flex-col justify-start">
          <div className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Decision
          </div>
          {readOnly ? (
            <div className="text-xs text-gray-700 space-y-1">
              {field.decision ? (
                <>
                  <div className="font-bold text-gray-900 capitalize">
                    {field.decision === 'no_action' ? 'No Action' : 'Accept'}
                  </div>
                  {field.reason && (
                    <div className="text-[11px] text-gray-600">
                      Reason: <span className="font-medium">{field.reason}</span>
                    </div>
                  )}
                  {field.note && (
                    <div className="text-[11px] text-gray-500 italic mt-1 break-words">
                      "{field.note}"
                    </div>
                  )}
                </>
              ) : (
                <span className="text-gray-400 italic">No decision yet</span>
              )}
            </div>
          ) : (
            <DecisionControls taskId={taskId} field={field} />
          )}
        </div>
      </div>

      {/* Accordion Description */}
      <div className="border-t border-gray-100">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer"
        >
          <span>Description</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div className={`accordion-content px-3.5 sm:px-4 bg-gray-50 text-xs sm:text-sm text-gray-600 border-t border-gray-100 ${expanded ? 'expanded' : ''}`}>
          {descriptionText}
        </div>
      </div>
    </div>
  )
}
