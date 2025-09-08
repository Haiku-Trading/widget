import { LexicalComposer } from '@lexical/react/LexicalComposer'
import React, { useCallback, useMemo } from 'react'
import { convertTokenListToMentionData, editorConfig, getDebugTextContent } from './utils/utils'
import { BeautifulMentionsPlugin } from 'lexical-beautiful-mentions'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { EnterCommandPlugin, ValueSyncPlugin } from './utils/pluggin'
import { EditorState } from 'lexical'
import { $getRoot } from 'lexical'
import NotFoundItemComponent from './components/tagging-not-found-item'
import TaggingMenu from './components/tagging-menu'
// Alternative: use StaticTaggingMenu for complete re-render prevention
// import StaticTaggingMenu from './components/static-tagging-menu'
import { useConfig } from 'wagmi'
import TaggingMenuItem from './components/tagging-menu-item'
import { TokenList } from '../../services/get-tokens'

type TaggingInputProps = {
  tokens?: TokenList
  value?: string
  placeholder?: string
  setValue: (value: string) => void
  setRawValue: (value: string) => void
  onSubmit?: () => void
}

const ITEMS_SIZE = 450
const TRIGGER_KEYS = ['@']

// Create static component references outside the component to prevent re-creation
const STATIC_COMPONENTS = {
  menuComponent: TaggingMenu,
  menuItemComponent: TaggingMenuItem,
  emptyComponent: NotFoundItemComponent,
} as const

// Create a memoized version of BeautifulMentionsPlugin
const MemoizedBeautifulMentionsPlugin = React.memo(BeautifulMentionsPlugin)

const TaggingInput: React.FC<TaggingInputProps> = React.memo(
  ({ tokens, value, placeholder, setValue, setRawValue, onSubmit }) => {
    const { chains } = useConfig()

    // Memoize the editor config to prevent re-creating it on every render
    const memoizedEditorConfig = useMemo(
      () => editorConfig(TRIGGER_KEYS, value ?? '', true),
      [value],
    )

    const searchHandle = useCallback(
      async (trigger: string, queryString?: string | null) => {
        return convertTokenListToMentionData(chains, queryString ?? '', tokens, ITEMS_SIZE)
      },
      [chains, tokens],
    )

    const valueChangeHandle = useCallback(
      (editorState: EditorState) => {
        editorState.read(() => {
          const root = $getRoot()
          const { rawText, iidText } = getDebugTextContent(root)
          setValue(iidText.trim())
          setRawValue(rawText.trim())
        })
      },
      [setValue, setRawValue],
    )

    // Memoize component references to prevent recreation
    const memoizedComponents = useMemo(() => STATIC_COMPONENTS, [])

    // Memoize the BeautifulMentionsPlugin props to prevent re-renders
    const mentionsPluginProps = useMemo(
      () => ({
        mentionEnclosure: 'true' as const,
        allowSpaces: false,
        autoSpace: true,
        creatable: false,
        showMentionsOnDelete: false,
        onSearch: searchHandle,
        triggers: TRIGGER_KEYS,
        ...memoizedComponents,
        insertOnBlur: false,
        menuItemLimit: ITEMS_SIZE,
      }),
      [searchHandle, memoizedComponents],
    )

    return (
      <LexicalComposer initialConfig={memoizedEditorConfig}>
        <div
          className="h-[56px] bg-secondary rounded-[24px] w-full pr-14 pl-4 max-sm:p-3 caret-primary outline-none flex justify-center items-center relative"
          id="lexical-input"
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  width: '100%',
                  outline: 'none',
                  scrollbarWidth: 'none',
                }}
                aria-placeholder={placeholder ?? ''}
                placeholder={
                  <span className="w-full h-full pointer-events-none pr-14 pl-4 absolute left-0 top-0 flex justify-start items-center select-none line-clamp-1 max-md:text-[0.8125rem] opacity-70">
                    {placeholder ?? ''}
                  </span>
                }
                className={`text-nowrap whitespace-nowrap overflow-auto ${(value ?? '').length > 0 ? 'tagging-input' : ''}`}
                id="tagging-input"
                autoFocus={true}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MemoizedBeautifulMentionsPlugin {...mentionsPluginProps} />
          <AutoFocusPlugin defaultSelection="rootEnd" key="autoFocus" />
          <ValueSyncPlugin value={value ?? ''} triggers={TRIGGER_KEYS} />
          <OnChangePlugin onChange={valueChangeHandle} />
          <HistoryPlugin delay={100} />
          <EnterCommandPlugin onSubmit={onSubmit} />
        </div>
      </LexicalComposer>
    )
  },
)

TaggingInput.displayName = 'TaggingInput'

export default TaggingInput
