import React, { useRef, useState } from 'react'
import { useReview } from '../../context/ReviewContext'
import type { Task, Queue, TaskField, DecisionChoice } from '../../types/review'
import {
  Upload,
  Download,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  FileCode,
} from 'lucide-react'
import * as XLSX from 'xlsx'

const STANDARD_FIELDS = [
  { path: '/government/government_position_held/office_holder', label: 'Officeholder' },
  { path: '/government/government_position_held/office_position_or_title', label: 'Office, position, or title' },
  { path: '/government/government_position_held/from', label: 'From' },
  { path: '/government/government_position_held/to', label: 'To' },
  { path: '/government/government_position_held/jurisdiction_of_office', label: 'Jurisdiction of office' },
  { path: '/government/government_position_held/basic_title', label: 'Basic title' },
]

export const AdminUploadSection: React.FC = () => {
  const { importTasks, lastImport, showToast } = useReview()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const downloadCsvTemplate = () => {
    const csv = [
      'Task,Job,Role,Field,Label,Current,Proposed,Description,Expected_Decision,Expected_Reason',
      'Task 101,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/office_holder,Officeholder,Jean-Marc Dupeyrat,Jean-Marc Dupeyrat,Verify official officeholder records against local prefecture gazette.,accept,',
      'Task 101,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/office_position_or_title,Office, position, or title,Mayor,Mayor of Sarzeau,Ensure commune specification matches official town registry.,no_action,incomplete_cvt',
      'Task 101,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/from,From,2026,2026,Verify starting election year.,accept,',
      'Task 101,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/to,To,2032,2032,Check term end date against electoral mandate.,accept,',
      'Task 101,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/jurisdiction_of_office,Jurisdiction of office,Sarzeau,Sarzeau,Check town jurisdiction name.,accept,',
      'Task 101,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/basic_title,Basic title,Mayor,Mayor,Verify mayor title matches category.,accept,',
      'Task 102,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/office_holder,Officeholder,Claire Boucher,Claire Boucher,Verify deputy mayor appointment in Morbihan gazette.,accept,',
      'Task 102,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/from,From,2024,2024,Verify start date.,accept,',
      'Task 102,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/to,To,2028,2028,Verify projected mandate end.,accept,',
      'Task 102,[Hume] Unreliable Sensitive Assertions Review,Reviewer,/government/government_position_held/basic_title,Basic title,Deputy Mayor,Deputy Mayor,Requires official deputy designation.,no_action,incomplete_cvt',
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'hume-tasks-template.csv'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded Hume CSV template with Description, Expected Decision & Reason columns.')
  }

  const downloadJsonTemplate = () => {
    const jsonSample = [
      {
        Task: 'Task 101',
        Job: '[Hume] Unreliable Sensitive Assertions Review',
        Role: 'Reviewer',
        Field: '/government/government_position_held/office_holder',
        Label: 'Officeholder',
        Current: 'Jean-Marc Dupeyrat',
        Proposed: 'Jean-Marc Dupeyrat',
        Description: 'Verify official officeholder records against local prefecture gazette.',
        Expected_Decision: 'accept',
        Expected_Reason: '',
      },
      {
        Task: 'Task 101',
        Job: '[Hume] Unreliable Sensitive Assertions Review',
        Role: 'Reviewer',
        Field: '/government/government_position_held/office_position_or_title',
        Label: 'Office, position, or title',
        Current: 'Mayor',
        Proposed: 'Mayor of Sarzeau',
        Description: 'Ensure commune specification matches official town registry.',
        Expected_Decision: 'no_action',
        Expected_Reason: 'incomplete_cvt',
      },
      {
        Task: 'Task 101',
        Job: '[Hume] Unreliable Sensitive Assertions Review',
        Role: 'Reviewer',
        Field: '/government/government_position_held/from',
        Label: 'From',
        Current: '2026',
        Proposed: '2026',
        Description: 'Verify starting election year.',
        Expected_Decision: 'accept',
        Expected_Reason: '',
      },
      {
        Task: 'Task 101',
        Job: '[Hume] Unreliable Sensitive Assertions Review',
        Role: 'Reviewer',
        Field: '/government/government_position_held/to',
        Label: 'To',
        Current: '2032',
        Proposed: '2032',
        Description: 'Check term end date against electoral mandate.',
        Expected_Decision: 'accept',
        Expected_Reason: '',
      },
    ]

    const blob = new Blob([JSON.stringify(jsonSample, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'hume-tasks-template.json'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded Hume JSON template.')
  }

  const loadSample = () => {
    processRecords(
      [
        // Sample task with 6 fields (valid >= 4)
        {
          Task: 'Hume Task 1',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/office_holder',
          Label: 'Officeholder',
          Current: 'Jean-Marc Dupeyrat',
          Proposed: 'Jean-Marc Dupeyrat',
          Expected_Decision: 'accept',
          Expected_Reason: '',
        },
        {
          Task: 'Hume Task 1',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/office_position_or_title',
          Label: 'Office, position, or title',
          Current: 'Mayor of Sarzeau',
          Proposed: 'Mayor of Sarzeau',
          Expected_Decision: 'accept',
          Expected_Reason: '',
        },
        {
          Task: 'Hume Task 1',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/from',
          Label: 'From',
          Current: '2026',
          Proposed: '2026',
          Expected_Decision: 'accept',
          Expected_Reason: '',
        },
        {
          Task: 'Hume Task 1',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/to',
          Label: 'To',
          Current: '2032',
          Proposed: '2032',
          Expected_Decision: 'no_action',
          Expected_Reason: 'incorrect_cvt',
        },
        {
          Task: 'Hume Task 1',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/jurisdiction_of_office',
          Label: 'Jurisdiction of office',
          Current: 'Sarzeau',
          Proposed: 'Sarzeau',
          Expected_Decision: 'accept',
          Expected_Reason: '',
        },
        {
          Task: 'Hume Task 1',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/basic_title',
          Label: 'Basic title',
          Current: 'Mayor',
          Proposed: 'Mayor',
          Expected_Decision: 'accept',
          Expected_Reason: '',
        },
        // Sample task with 4 fields (valid >= 4)
        {
          Task: 'Hume Task 2',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/office_holder',
          Label: 'Officeholder',
          Current: 'Hélène Renaud',
          Proposed: 'Hélène Renaud',
          Expected_Decision: 'accept',
          Expected_Reason: '',
        },
        {
          Task: 'Hume Task 2',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/office_position_or_title',
          Label: 'Office, position, or title',
          Current: 'Prefect',
          Proposed: 'Prefect of Morbihan',
          Expected_Decision: 'no_action',
          Expected_Reason: 'incomplete_cvt',
        },
        {
          Task: 'Hume Task 2',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/from',
          Label: 'From',
          Current: '2025',
          Proposed: '2025',
          Expected_Decision: 'accept',
          Expected_Reason: '',
        },
        {
          Task: 'Hume Task 2',
          Job: '[Hume] Unreliable Sensitive Assertions Review',
          Role: 'Reviewer',
          Field: '/government/government_position_held/to',
          Label: 'To',
          Current: '2030',
          Proposed: '2030',
          Expected_Decision: 'accept',
          Expected_Reason: '',
        },
      ],
      'Sample 4+ Field Hume Tasks'
    )
  }

  const cleanKey = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, '')

  const headerValue = (row: Record<string, any>, names: string[]): string => {
    const cleanNames = names.map(cleanKey)
    const key = Object.keys(row).find((name) =>
      cleanNames.includes(cleanKey(name))
    )
    return key ? String(row[key] || '').trim() : ''
  }

  const processRecords = (records: any[], fileLabel: string) => {
    const grouped = new Map<
      string,
      { name: string; job: string; role: string; description?: string; fields: TaskField[] }
    >()
    let blankRows = 0

    records.forEach((row) => {
      const taskIdentifier =
        headerValue(row, [
          'task',
          'taskid',
          'task_id',
          'task name',
          'task_name',
          'taskname',
          'name',
          'id',
          'task #',
          'task_no',
          'taskno',
        ]) ||
        headerValue(row, ['job', 'job name', 'job_name', 'queue']) ||
        'Hume Task'

      const job = '[Hume] Unreliable Sensitive Assertions Review'
      const role = headerValue(row, ['role', 'role name', 'work_role']) || 'Reviewer'
      const path = headerValue(row, [
        'field',
        'field path',
        'field_path',
        'path',
        'fieldname',
        'field_name',
        'column',
        'property',
      ])
      const label = headerValue(row, [
        'label',
        'field label',
        'field_label',
        'display_name',
        'title',
      ])
      const current = headerValue(row, [
        'current',
        'current value',
        'current_value',
        'existing',
        'old',
      ])
      const proposed = headerValue(row, [
        'proposed',
        'proposed value',
        'proposed_value',
        'new',
        'suggested',
      ])

      const description = headerValue(row, [
        'description',
        'desc',
        'field_description',
        'field description',
        'instructions',
        'instruction',
        'guideline',
        'notes',
      ])

      const taskDescription = headerValue(row, [
        'task_description',
        'task description',
        'taskdesc',
        'job_description',
        'job description',
      ])

      const rawExpected = (
        headerValue(row, [
          'expected_decision',
          'expected decision',
          'expecteddecision',
          'correct_decision',
          'correct decision',
          'correctdecision',
          'expected',
          'correct',
        ]) || ''
      )
        .toLowerCase()
        .trim()

      const expectedDecision: DecisionChoice =
        rawExpected === 'accept'
          ? 'accept'
          : rawExpected === 'no_action' ||
            rawExpected === 'no action' ||
            rawExpected === 'noaction'
          ? 'no_action'
          : ''

      const expectedReason =
        headerValue(row, [
          'expected_reason',
          'expected reason',
          'expectedreason',
          'correct_reason',
          'correct reason',
          'correctreason',
          'reason',
        ]) || ''

      if (!path && !current && !proposed) {
        blankRows += 1
        return
      }

      const key = `${taskIdentifier}||${job}`
      if (!grouped.has(key)) {
        grouped.set(key, {
          name: job,
          job,
          role,
          description: taskDescription || '',
          fields: [],
        })
      }

      const currentGroup = grouped.get(key)!
      if (taskDescription && !currentGroup.description) {
        currentGroup.description = taskDescription
      }

      const fieldPath =
        path ||
        `/government/government_position_held/${(label || `field_${currentGroup.fields.length + 1}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')}`

      currentGroup.fields.push({
        id: `f${currentGroup.fields.length + 1}`,
        path: fieldPath,
        label: label || '',
        current,
        proposed,
        decision: '',
        reason: '',
        note: '',
        description: description || '',
        expectedDecision,
        expectedReason,
      })
    })

    const newQueues: Queue[] = [
      {
        id: 'q-hume',
        job: '[Hume] Unreliable Sensitive Assertions Review',
        role: 'Reviewer',
      },
    ]
    const newTasks: Task[] = []
    let addedCount = 0
    let rejectedCount = 0

    // Enforce Rule: At least ANY 4 fields are required to create a task
    grouped.forEach((group, taskKey) => {
      if (group.fields.length < 4) {
        rejectedCount += 1
        return
      }

      const cleanTaskId = taskKey.split('||')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')
      newTasks.push({
        id: `hume-${cleanTaskId}-${Date.now()}-${addedCount}`,
        queueId: 'q-hume',
        name: '[Hume] Unreliable Sensitive Assertions Review',
        description: group.description || '',
        entityId: '',
        status: 'ready',
        workStatus: 'Waiting',
        assignedTo: '',
        fields: group.fields,
      })
      addedCount += 1
    })

    if (addedCount === 0 && rejectedCount > 0) {
      showToast(
        `Creation rejected: ${rejectedCount} task(s) had fewer than 4 fields. Any 4 fields are required to create a task.`
      )
      return
    }

    if (addedCount === 0) {
      showToast(`No valid tasks found in ${fileLabel}. Each task must contain at least 4 fields.`)
      return
    }

    const skippedNote =
      rejectedCount > 0
        ? ` (${rejectedCount} task(s) skipped with fewer than 4 fields)`
        : ''
    const msg = `Created ${addedCount} task(s) from ${fileLabel}.${skippedNote}`
    showToast(msg)

    importTasks(newQueues, newTasks, fileLabel, blankRows)
  }

  const handleUploadedFile = async (file: File) => {
    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text()
        const parsed = JSON.parse(text)
        if (Array.isArray(parsed)) {
          // Check if it's an array of task objects (with fields)
          if (parsed.length > 0 && Array.isArray(parsed[0]?.fields)) {
            const newQueues: Queue[] = [
              {
                id: 'q-hume',
                job: '[Hume] Unreliable Sensitive Assertions Review',
                role: 'Reviewer',
              },
            ]
            const newTasks: Task[] = []
            let addedCount = 0
            let rejectedCount = 0

            parsed.forEach((t: any, idx: number) => {
              const fields = Array.isArray(t.fields) ? t.fields : []
              if (fields.length < 4) {
                rejectedCount += 1
                return
              }
              newTasks.push({
                id: t.id || `hume-json-${Date.now()}-${idx}`,
                queueId: 'q-hume',
                name: '[Hume] Unreliable Sensitive Assertions Review',
                description: t.description || '',
                entityId: t.entityId || '',
                status: 'ready',
                workStatus: 'Waiting',
                assignedTo: '',
                fields: fields.map((f: any, fIdx: number) => ({
                  id: f.id || `f${fIdx + 1}`,
                  path: f.path || '/government/government_position_held/value',
                  label: f.label || '',
                  current: f.current || '',
                  proposed: f.proposed || '',
                  decision: '',
                  reason: '',
                  note: '',
                  description: f.description || '',
                  expectedDecision:
                    f.expectedDecision === 'accept'
                      ? 'accept'
                      : f.expectedDecision === 'no_action'
                      ? 'no_action'
                      : '',
                  expectedReason: f.expectedReason || '',
                })),
              })
              addedCount += 1
            })

            if (addedCount === 0) {
              showToast(`No valid tasks found in ${file.name}. Each task must contain at least 4 fields.`)
              return
            }

            const skippedNote = rejectedCount > 0 ? ` (${rejectedCount} skipped with <4 fields)` : ''
            showToast(`Imported ${addedCount} task(s) from ${file.name}.${skippedNote}`)
            importTasks(newQueues, newTasks, file.name, 0)
            return
          } else {
            // Flat rows JSON
            processRecords(parsed, file.name)
            return
          }
        } else {
          showToast('Invalid JSON structure: expected an array of tasks or rows.')
          return
        }
      }

      // CSV or Excel
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const records = XLSX.utils.sheet_to_json(firstSheet, { defval: '' })
      processRecords(records, file.name)
    } catch (err: any) {
      showToast(err.message || 'Failed to read spreadsheet file.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleUploadedFile(file)
      }}
      className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 transition-all ${
        isDragging
          ? 'border-blue-500 bg-blue-50/80 ring-4 ring-blue-100 shadow-md'
          : 'border-[#b7c7da] bg-[#f8fbfe]'
      } flex flex-col gap-4`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Upload Tasks (CSV, Excel, JSON)</span>
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              Any 4 fields required to create
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
            Upload CSV, Excel, or JSON files to dynamically create evaluation tasks. Each task requires at least{' '}
            <strong className="text-blue-700 font-bold underline decoration-blue-300">any 4 fields</strong>{' '}
            to be created. Drag and drop any file directly onto this box.
          </p>

          {/* Standard Fields Pills */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-slate-700 mr-1">Standard fields:</span>
            {STANDARD_FIELDS.map((f, i) => (
              <span
                key={f.path}
                className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-medium shadow-2xs"
              >
                {i + 1}. {f.label}
              </span>
            ))}
          </div>

          {lastImport && (
            <p className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg mt-2.5 inline-block border border-emerald-200">
              {lastImport}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0 self-start">
          <button
            type="button"
            onClick={downloadCsvTemplate}
            className="flex-1 sm:flex-initial justify-center px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Template</span>
          </button>

          <button
            type="button"
            onClick={downloadJsonTemplate}
            className="flex-1 sm:flex-initial justify-center px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON Template</span>
          </button>

          <button
            type="button"
            onClick={loadSample}
            className="flex-1 sm:flex-initial justify-center px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Tasks</span>
          </button>

          <label className="w-full sm:w-auto justify-center px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json,text/csv,application/json"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUploadedFile(file)
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
