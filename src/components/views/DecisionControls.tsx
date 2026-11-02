import React from 'react'
import { useReview } from '../../context/ReviewContext'
import type { TaskField, DecisionChoice } from '../../types/review'
import { Check } from 'lucide-react'

interface DecisionControlsProps {
  taskId: string
  field: TaskField
}

const REASONS = [
  { value: 'incorrect', label: 'Incorrect CVT' },
  { value: 'incomplete', label: 'Incomplete CVT' },
  { value: 'unidentifiable', label: 'Unidentifiable CVT' },
  { value: 'no-sources', label: 'No Sources/Contradicting Sources' },
  { value: 'disagreement', label: 'Disagreement/Revisit' },
  { value: 'none', label: 'None of the above' },
]

export const DecisionControls: React.FC<DecisionControlsProps> = ({ taskId, field }) => {
  const { updateFieldDecision, updateFieldReason, updateFieldNote } = useReview()

  const handleDecisionClick = (choice: DecisionChoice) => {
    // Allows toggling off if clicked again
    if (field.decision === choice) {
      updateFieldDecision(taskId, field.id, '')
      updateFieldReason(taskId, field.id, '')
    } else {
      updateFieldDecision(taskId, field.id, choice)
      if (choice === 'accept') {
        updateFieldReason(taskId, field.id, '')
      }
    }
  }

  const handleReasonClick = (reasonVal: string) => {
    if (field.reason === reasonVal) {
      updateFieldReason(taskId, field.id, '')
    } else {
      updateFieldReason(taskId, field.id, reasonVal)
    }
  }

  const isAccept = field.decision === 'accept'
  const isNoAction = field.decision === 'no_action'
  const hasDecision = isAccept || isNoAction

  return (
    <div className="flex flex-col space-y-3 text-sm text-gray-500 justify-start w-full">
      {/* Main Radio Group */}
      <div className="flex items-center space-x-6 main-radio-group">
        <label
          onClick={(e) => {
            e.preventDefault()
            handleDecisionClick('accept')
          }}
          className="flex items-center space-x-2 cursor-pointer group select-none"
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
              isAccept
                ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                : 'border-[#9aa0a6] group-hover:border-[#5f6368] bg-white'
            }`}
          >
            {isAccept && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <span
            className={`transition-colors group-hover:text-gray-900 ${
              isAccept ? 'font-medium text-gray-900' : 'text-gray-600'
            }`}
          >
            Accept
          </span>
        </label>

        <label
          onClick={(e) => {
            e.preventDefault()
            handleDecisionClick('no_action')
          }}
          className="flex items-center space-x-2 cursor-pointer group select-none"
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
              isNoAction
                ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                : 'border-[#9aa0a6] group-hover:border-[#5f6368] bg-white'
            }`}
          >
            {isNoAction && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <span
            className={`transition-colors group-hover:text-gray-900 ${
              isNoAction ? 'font-medium text-gray-900' : 'text-gray-600'
            }`}
          >
            No Action
          </span>
        </label>
      </div>

      {/* Reasons Box for No Action */}
      {isNoAction && (
        <div className="w-full flex flex-col space-y-2 border-t border-gray-200 pt-3 animate-fade-in">
          <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
            Select Reason for no action:
          </span>
          {REASONS.map((r) => {
            const isReasonSelected = field.reason === r.value
            return (
              <label
                key={r.value}
                onClick={(e) => {
                  e.preventDefault()
                  handleReasonClick(r.value)
                }}
                className="flex items-center space-x-2 cursor-pointer group text-xs text-gray-600 select-none"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                    isReasonSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-[#9aa0a6] group-hover:border-[#5f6368] bg-white'
                  }`}
                >
                  {isReasonSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span
                  className={`transition-colors group-hover:text-gray-900 ${
                    isReasonSelected ? 'font-medium text-gray-900' : ''
                  }`}
                >
                  {r.label}
                </span>
              </label>
            )
          })}
        </div>
      )}

      {/* Sources Box */}
      {hasDecision && (
        <div className="w-full mt-2 animate-fade-in">
          <textarea
            value={field.note || ''}
            onChange={(e) => updateFieldNote(taskId, field.id, e.target.value)}
            rows={2}
            placeholder="Enter sources and findings..."
            className="w-full border border-gray-300 rounded p-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-white"
          />
        </div>
      )}
    </div>
  )
}
