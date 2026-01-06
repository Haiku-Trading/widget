import { $convertToMentionNodes, $isBeautifulMentionNode, BeautifulMentionNode, BeautifulMentionsItem, createBeautifulMentionNode, PlaceholderNode } from "lexical-beautiful-mentions"
import { InitialConfigType } from "@lexical/react/LexicalComposer"
import {
    $createParagraphNode,
    $getRoot,
    $isElementNode,
    LexicalNode,
} from 'lexical'
import TaggingMetadata from "../components/tagging-metadata"
import { Chain } from "viem"
import { TokenList } from "../../../services/get-tokens"
import { protocolsConfig } from "../../../constants/constants"
import { matchSorter } from "match-sorter"

const [CustomBeautifulMentionNode, replacement] =
    createBeautifulMentionNode(TaggingMetadata)

const setEditorState = (initialValue: string, triggers: string[]) => {
    return () => {
        const root = $getRoot()
        if (root.getFirstChild() === null) {
            const paragraph = $createParagraphNode()
            paragraph.append(...$convertToMentionNodes(initialValue, triggers))
            root.append(paragraph)
        }
    }
}

export const editorConfig = (
    triggers: string[],
    initialValue: string,
    customMentionNode: boolean,
): InitialConfigType => ({
    namespace: '',
    onError(error) {
        throw error
    },
    editorState: setEditorState(initialValue, triggers),
    nodes: [
        ...(customMentionNode ? [CustomBeautifulMentionNode, replacement] : [BeautifulMentionNode]),
        PlaceholderNode,
    ],
})

export const getDebugTextContent = (node: LexicalNode): { rawText: string; iidText: string } => {
    const result: {
        rawText: string
        iidText: string
    } = {
        rawText: '',
        iidText: '',
    }

    if ($isElementNode(node)) {
        const children = node.getChildren()
        for (const child of children) {
            const childContent = getDebugTextContent(child)
            result.rawText += childContent.rawText
            result.iidText += childContent.iidText
        }
    } else if ($isBeautifulMentionNode(node)) {
        const mentionText = node.getTextContent().replace('@', '')
        result.rawText += mentionText
        try {
            const data = node.getData()
            if (
                data?.type === 'Token' ||
                data?.type === 'Pools' ||
                data?.type === 'Vault' ||
                data?.type === 'Lending'
            ) {
                const metadata = JSON.parse(data?.metadata?.toString() || '{}')
                if (metadata.iid) {
                    result.iidText += metadata.iid
                }
            } else {
                result.iidText += mentionText
            }
        } catch (e) {
            console.error('Failed to parse mention metadata', e)
        }
    } else {
        result.rawText += node.getTextContent()
        result.iidText += node.getTextContent()
    }

    return result
}

export const convertTokenListToMentionData = (
    chains: readonly [Chain, ...Chain[]],
    queryString: string,
    tokens?: TokenList,
    size: number = 1000
) => {
    const items: BeautifulMentionsItem[] = []
    if (chains) {
        const searchChains = chains.filter(
            (chain) => chain.name.toLowerCase().includes(queryString.toLowerCase()) || String(chain.id).toLowerCase().includes(queryString.toLowerCase())
        );
        matchSorter(searchChains, queryString, {
            keys: ['name', 'id'],
            baseSort: (a, b) => a.index - b.index,
        }).forEach((chain, index) => {
            items.push({
                id: `${index}:chain:${chain.id}`,
                type: 'Chain',
                value: chain.name,
                imageUrl: null,
                isFirst: index === 0,
                metadata: JSON.stringify(chain),
            })
        })
    }

    if (Object.values(protocolsConfig)) {
        const searchProtocols = Object.values(protocolsConfig)
            .filter(
                (protocol) => protocol.name.toLowerCase().includes(queryString.toLowerCase()) || String(protocol.symbol).toLowerCase().includes(queryString.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name))

        matchSorter(searchProtocols, queryString, {
            keys: ['name', 'symbol'],
            baseSort: (a, b) => a.item.name.localeCompare(b.item.name),
        }).forEach((protocol, index) => {
            items.push({
                id: `${index}:protocol:${protocol.symbol}`,
                type: 'Protocol',
                value: protocol.name,
                imageUrl: null,
                isFirst: index === 0,
                metadata: JSON.stringify(protocol)
            })
        })
    }

    if (tokens && tokens.tokens) {
        const sizeOfToken = Math.round((size - items.length) / 4)

        const searchTokens = tokens.tokens.filter((token) =>
            token.symbol.toLowerCase().includes(queryString.toLowerCase()) || token.name.toLowerCase().includes(queryString.toLowerCase()) || String(token.network).toLowerCase().includes(queryString.toLowerCase())
        ).slice(0, sizeOfToken - 1)

        matchSorter(searchTokens, queryString, {
            keys: ['name', 'symbol', 'network'],
            baseSort: (a, b) => a.index - b.index,
        }).forEach((token, index) => {
            const branches = [
                {
                    symbol: token.network.toString(),
                },
            ]

            if ('protocol' in token) {
                branches.push({
                    symbol: token.protocol as string,
                })
            }
            items.push({
                id: `${index}:token:${token.iid}`,
                type: 'Token',
                value: token.symbol,
                imageUrl: 'logoURI' in token ? token?.logoURI || '' : '',
                branches: JSON.stringify(branches.length > 0 ? branches : undefined),
                isFirst: index === 0,
                metadata: JSON.stringify(token),
            })
        }
        );
    }

    if (tokens && tokens.weightedLiquidityTokens) {
        const sizeOfPool = Math.round((size - items.length) / 3)
        const searchPools = tokens.weightedLiquidityTokens.filter((pool) =>
            pool.symbol.toLowerCase().includes(queryString.toLowerCase()) || pool.protocol.toLowerCase().includes(queryString.toLowerCase()) || String(pool.network).toLowerCase().includes(queryString.toLowerCase())
        ).slice(0, sizeOfPool - 1)

        matchSorter(searchPools, queryString, {
            keys: ['symbol', 'protocol', 'network'],
            baseSort: (a, b) => a.index - b.index,
        }).forEach((pool, index) => {
            const branches = [
                {
                    symbol: pool.network.toString(),
                },
            ]

            if ('protocol' in pool) {
                branches.push({
                    symbol: pool.protocol as string,
                })
            }
            items.push({
                id: `${index}:pool:${pool.iid}`,
                type: 'Pool',
                value: pool.symbol,
                imageUrl: 'logoURI' in pool ? String(pool?.logoURI) || '' : '',
                branches: JSON.stringify(branches.length > 0 ? branches : undefined),
                isFirst: index === 0,
                metadata: JSON.stringify(pool),
                searchData: `${pool.symbol}:${pool.protocol}:${pool.network}`
            })
        }
        );
    }

    if (tokens && tokens.vaultTokens) {
        const sizeOfVault = Math.round((size - items.length) / 2)
        const searchVaults = tokens.vaultTokens.filter((vault) =>
            vault.symbol.toLowerCase().includes(queryString.toLowerCase()) || vault.protocol.toLowerCase().includes(queryString.toLowerCase()) || String(vault.network).toLowerCase().includes(queryString.toLowerCase())
        ).slice(0, sizeOfVault - 1)
        matchSorter(searchVaults, queryString, {
            keys: ['symbol', 'protocol', 'network'],
            baseSort: (a, b) => a.index - b.index,
        }).forEach((vault, index) => {
            const branches = [
                {
                    symbol: vault.network.toString(),
                },
            ]

            if ('protocol' in vault) {
                branches.push({
                    symbol: vault.protocol as string,
                })
            }
            items.push({
                id: `${index}:vault:${vault.iid}`,
                type: 'Vault',
                value: vault.symbol,
                imageUrl: 'logoURI' in vault ? String(vault?.logoURI) || '' : '',
                branches: JSON.stringify(branches.length > 0 ? branches : undefined),
                isFirst: index === 0,
                metadata: JSON.stringify(vault)
            })
        }
        );
    }

    if (tokens && (tokens.collateralTokens || tokens.varDebtTokens)) {
        const sizeOfLending = Math.round((size - items.length) / 1)
        const lendingTokens = [...(tokens.collateralTokens ?? []), ...(tokens.varDebtTokens ?? [])];
        const searchLendings = lendingTokens.filter((lending) =>
            lending.symbol.toLowerCase().includes(queryString.toLowerCase()) || lending.protocol.toLowerCase().includes(queryString.toLowerCase()) || String(lending.network).toLowerCase().includes(queryString.toLowerCase())
        ).slice(0, sizeOfLending - 1)
        matchSorter(searchLendings, queryString, {
            keys: ['symbol', 'protocol', 'network'],
            baseSort: (a, b) => a.index - b.index,
        }).forEach((lending, index) => {
                const branches = [
                    {
                        symbol: lending.network.toString(),
                    },
                ]

                if ('protocol' in lending) {
                    branches.push({
                        symbol: lending.protocol as string,
                    })
                }
                items.push({
                    id: `${index}:lending:${lending.iid}`,
                    type: 'Lending',
                    value: lending.symbol,
                    imageUrl: 'logoURI' in lending ? String(lending?.logoURI) || '' : '',
                    branches: JSON.stringify(branches.length > 0 ? branches : undefined),
                    isFirst: index === 0,
                    metadata: JSON.stringify(lending)
                })
            }
            );
    }

    return items;
}